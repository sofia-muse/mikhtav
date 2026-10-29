import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { officialUrl, fetchOfficial, changeStatus, validateManifest } from './transport.mjs'

test('rejects non-string identifiers and relationships before coercion', () => {
  for (const id of [undefined, null, 123]) assert.throws(() => validateManifest({schemaVersion: 1, documents:[{id}]}), /document ID/)
  const doc = { id:'sample', kind:'form', issuer:'bituach-leumi', officialTitleHe:'טופס', sourcePageUrl:'https://www.btl.gov.il/a', downloadUrl:null, relatedLetterSlugs:[null] }
  assert.throws(() => validateManifest({schemaVersion:1, documents:[doc]}), /guide relation/)
})

test('restricts destinations including every redirect hop', async () => {
  for (const value of ['http://www.gov.il/a', 'https://www.gov.il.evil.test/a', 'https://ps.btl.gov.il/a', 'https://u:p@www.gov.il/a', 'https://www.gov.il:444/a'])
    assert.throws(() => officialUrl(value))
  let calls = 0
  await assert.rejects(fetchOfficial('https://www.gov.il/a', { format: 'pdf', fetchImpl: async () => { calls++; return new Response(null, { status: 302, headers: { location: 'https://evil.test/a.pdf' } }) } }), /registered public/)
  assert.equal(calls, 1)
})

test('preserves exact PDF bytes and computes a reproducible checksum', async () => {
  const body = Buffer.from('%PDF-1.7\noriginal unchanged Hebrew bytes\n%%EOF')
  const original = await fetchOfficial('https://www.btl.gov.il/a.pdf', { format: 'pdf', fetchImpl: async () => new Response(body, { headers: { 'content-type': 'application/pdf' } }) })
  assert.ok(original.bytes.equals(body))
  assert.equal(original.sha256, createHash('sha256').update(body).digest('hex'))
  assert.equal(changeStatus(null, original), 'new')
  assert.equal(changeStatus(original, original), 'unchanged')
  assert.equal(changeStatus(original, { sha256: 'changed' }), 'changed')
  assert.equal(changeStatus(original, null), 'unavailable')
})

test('never treats HTTP errors or HTML challenge pages as downloaded PDFs', async () => {
  await assert.rejects(fetchOfficial('https://www.gov.il/a.pdf', { format: 'pdf', fetchImpl: async () => new Response('<html>denied</html>', { status: 403 }) }), error => error.httpStatus === 403)
  await assert.rejects(fetchOfficial('https://www.gov.il/a.pdf', { format: 'pdf', fetchImpl: async () => new Response('<html>login</html>', { headers: { 'content-type': 'application/pdf' } }) }), /not a complete PDF/)
})

test('enforces decompressed stream limits even without Content-Length', async () => {
  await assert.rejects(fetchOfficial('https://www.gov.il/a', { format: 'pdf', maxBytes: 10, fetchImpl: async () => new Response('x'.repeat(100)) }), /size limit/)
})

test('requires expected public HTML content rather than an error title', async () => {
  const valid = '<!doctype html><html><title>Official guide</title><h1>אישור תקופות ביטוח</h1></html>'
  const result = await fetchOfficial('https://www.btl.gov.il/a', { format: 'html', expectedMarker: 'תקופות ביטוח', fetchImpl: async () => new Response(valid, { headers: { 'content-type': 'text/html' } }) })
  assert.equal(result.observedTitle, 'Official guide')
  await assert.rejects(fetchOfficial('https://www.btl.gov.il/a', { format: 'html', expectedMarker: 'תקופות ביטוח', fetchImpl: async () => new Response('<html><title>Access denied</title><p>תקופות ביטוח</p></html>', { headers: { 'content-type': 'text/html' } }) }), /not found/)
})
