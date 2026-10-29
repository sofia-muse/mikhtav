import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { validateManifest, fetchOfficial, changeStatus } from './transport.mjs'

const root = new URL('../../', import.meta.url)
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'))
const manifest = validateManifest(await read('data/official/manifest.json'))
let previous = { documents: {} }
try { previous = await read('data/official/last-success.json') } catch (error) { if (error.code !== 'ENOENT') throw error }
const checkedAt = new Date().toISOString()
const documents = []
const log = []
const requests = new Map()
await mkdir(new URL('data/official/snapshots/', root), { recursive: true })
await mkdir(new URL('src/web/public/official/files/', root), { recursive: true })
for (const document of manifest.documents) {
  const format = document.downloadUrl ? 'pdf' : 'html'
  const sourceUrl = document.downloadUrl ?? document.sourcePageUrl
  const old = previous.documents[document.id] ?? null
  const base = { status: 'unavailable', checkedAt, httpStatus: null, contentType: null, sha256: null,
    bytes: null, localPath: null, sourceUrl, finalUrl: null, method: format === 'pdf' ? 'public-pdf' : 'public-html',
    change: 'unavailable', reviewStatus: 'not-reviewed' }
  try {
    // Only manifest-registered resources are fetched, never links/forms discovered inside HTML.
    const expectedMarker = document.expectedMarker ?? document.officialTitleHe
    const requestKey = JSON.stringify([sourceUrl, format, expectedMarker])
    if (!requests.has(requestKey)) requests.set(requestKey, fetchOfficial(sourceUrl, {
      format, expectedMarker,
    }))
    const original = await requests.get(requestKey)
    const filename = `${original.sha256}.${format}`
    const snapshot = `data/official/snapshots/${filename}`
    await writeFile(new URL(snapshot, root), original.bytes)
    let localPath = null
    if (format === 'pdf') {
      localPath = `/official/files/${filename}`
      await writeFile(new URL(`src/web/public${localPath}`, root), original.bytes)
    }
    const retrieval = { ...base, status: 'verified', httpStatus: original.httpStatus,
      contentType: original.contentType, sha256: original.sha256, bytes: original.bytes.length,
      localPath, finalUrl: original.finalUrl, observedTitle: original.observedTitle,
      sourceLastModified: original.sourceLastModified, change: changeStatus(old, original) }
    previous.documents[document.id] = { ...retrieval, snapshot }
    documents.push({ ...document, retrieval })
    log.push({ id: document.id, ...retrieval, previousSha256: old?.sha256 ?? null })
  } catch (error) {
    // Retain earlier immutable archives, but never mark an old download as a successful new fetch.
    const retrieval = { ...base, httpStatus: error.httpStatus ?? null, error: error.message }
    documents.push({ ...document, retrieval })
    log.push({ id: document.id, ...retrieval, previousSha256: old?.sha256 ?? null, lastSuccessfulAt: old?.checkedAt ?? null })
  }
}
const encode = value => JSON.stringify(value, null, 2) + '\n'
await writeFile(new URL('src/web/public/official/documents.json', root), encode({ schemaVersion: 1, generatedAt: checkedAt, documents }))
await writeFile(new URL('data/official/last-success.json', root), encode(previous))
await mkdir(new URL('data/official/runs/', root), { recursive: true })
await writeFile(new URL(`data/official/runs/${checkedAt.replace(/[:.]/g, '-')}.json`, root), encode({ checkedAt, documents: log }))
const verified = documents.filter(d => d.retrieval.status === 'verified').length
console.log(`Official import: ${verified}/${documents.length} originals retrieved. ${documents.length - verified} unavailable; no editorial review dates changed.`)
for (const doc of documents) console.log(`${doc.id}: ${doc.retrieval.status} ${doc.retrieval.httpStatus ?? ''} ${doc.retrieval.bytes ?? ''}`)
if (!verified) process.exitCode = 1
