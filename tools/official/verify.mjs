import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { validateManifest, officialUrl } from './transport.mjs'

const root = new URL('../../', import.meta.url)
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'))
const source = validateManifest(await json('data/official/manifest.json'))
const catalog = validateManifest(await json('src/web/public/official/documents.json'))
const englishIndex = await json('src/web/public/catalog/en/index.json')
const slugs = new Set(englishIndex.flatMap(c => c.letters.map(l => l.slug)))
assert.deepEqual(catalog.documents.map(d => d.id), source.documents.map(d => d.id), 'Registry/catalog IDs')
let successful = 0
for (const [i, document] of catalog.documents.entries()) {
  const { retrieval, ...registryFields } = document
  assert.deepEqual(registryFields, source.documents[i], 'Published metadata matches curated registry')
  assert.ok(!Number.isNaN(Date.parse(retrieval.checkedAt)), 'Actual attempt timestamp')
  assert.ok(document.relatedLetterSlugs.every(slug => slugs.has(slug)), 'Valid related guide')
  if (retrieval.status === 'unavailable') {
    assert.equal(retrieval.localPath, null)
    assert.equal(retrieval.sha256, null)
    assert.equal(retrieval.bytes, null)
    continue
  }
  assert.equal(retrieval.status, 'verified')
  assert.ok(retrieval.httpStatus >= 200 && retrieval.httpStatus < 300)
  assert.match(retrieval.sha256, /^[a-f0-9]{64}$/)
  officialUrl(retrieval.finalUrl)
  assert.equal(retrieval.sourceUrl, document.downloadUrl ?? document.sourcePageUrl)
  assert.equal(retrieval.reviewStatus, 'not-reviewed', 'Fetching is not professional/editorial approval')
  const extension = document.downloadUrl ? 'pdf' : 'html'
  const bytes = await readFile(new URL(`data/official/snapshots/${retrieval.sha256}.${extension}`, root))
  assert.equal(bytes.length, retrieval.bytes)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), retrieval.sha256, 'Exact archive checksum')
  if (document.downloadUrl) {
    assert.equal(retrieval.contentType, 'application/pdf')
    assert.equal(retrieval.localPath, `/official/files/${retrieval.sha256}.pdf`)
    const cached = await readFile(new URL(`src/web/public${retrieval.localPath}`, root))
    assert.ok(bytes.equals(cached), 'Cached original must be byte-for-byte identical')
    assert.equal(cached.subarray(0, 5).toString(), '%PDF-')
  } else assert.equal(retrieval.localPath, null, 'Never serve imported HTML as executable site content')
  successful++
}
assert.ok(successful > 0, 'At least one source was actually fetched')
console.log(`Official catalog verified: ${successful}/${catalog.documents.length} originals, exact hashes, 4 locales and honest unavailable states.`)
