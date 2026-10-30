"""Generate published first-page WebP previews from already verified local PDFs.

Requires Pillow and Poppler's pdftoppm (on PATH, or --pdftoppm). Never fetches sources.
Run: python tools/official/previews.py --pdftoppm /path/to/pdftoppm
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
from PIL import Image

def generate(pdftoppm):
    root = Path(__file__).resolve().parents[2]
    public = root / 'src/web/public'
    manifest_path = public / 'official/documents.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    output = public / 'official/previews'
    output.mkdir(parents=True, exist_ok=True)
    count = 0
    for document in manifest['documents']:
        retrieval = document['retrieval']
        document.pop('preview', None)
        if retrieval['status'] != 'verified' or retrieval['contentType'] != 'application/pdf':
            continue
        digest = retrieval['sha256']
        source = public / retrieval['localPath'].lstrip('/')
        original = source.read_bytes()
        if hashlib.sha256(original).hexdigest() != digest:
            raise ValueError(f"Original checksum mismatch: {document['id']}")
        with tempfile.TemporaryDirectory() as temp:
            prefix = Path(temp) / 'first-page'
            subprocess.run([pdftoppm, '-f', '1', '-singlefile', '-scale-to-x', '480', '-scale-to-y', '-1', '-png', str(source), str(prefix)], check=True, capture_output=True)
            with Image.open(prefix.with_suffix('.png')) as rendered:
                image = rendered.convert('RGB')
                if image.width != 480:
                    raise ValueError('Expected 480px preview width')
                image.save(output / f'{digest}.webp', 'WEBP', quality=85, method=6)
                document['preview'] = {'url': f'/official/previews/{digest}.webp', 'width': image.width, 'height': image.height, 'sourceSha256': digest}
        if source.read_bytes() != original:
            raise ValueError('Original changed during preview generation')
        count += 1
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{count} first-page previews generated; originals unchanged.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdftoppm', default='pdftoppm')
    generate(parser.parse_args().pdftoppm)
