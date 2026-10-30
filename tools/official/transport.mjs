import { createHash } from 'node:crypto'

const HOSTS = new Set(['www.btl.gov.il', 'btl.gov.il', 'www.gov.il', 'gov.il'])
export function officialUrl(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || !HOSTS.has(url.hostname) || url.username || url.password || (url.port && url.port !== '443'))
    throw new Error('Only registered public official HTTPS hosts are allowed')
  return url
}

export function validateManifest(manifest) {
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.documents)) throw new Error('Invalid manifest version')
  const ids = new Set()
  for (const doc of manifest.documents) {
    if (typeof doc.id !== 'string' || !/^[a-z0-9-]+$/.test(doc.id) || ids.has(doc.id)) throw new Error('Invalid or duplicate document ID')
    ids.add(doc.id)
    if (!['form', 'guide', 'certificate-info', 'notice-template'].includes(doc.kind)) throw new Error('Invalid document kind')
    if (!['bituach-leumi', 'tax-authority', 'population-authority'].includes(doc.issuer)) throw new Error('Invalid issuer')
    if (typeof doc.officialTitleHe !== 'string' || !doc.officialTitleHe.trim()) throw new Error('Missing official title')
    officialUrl(doc.sourcePageUrl)
    if (doc.downloadUrl !== null) officialUrl(doc.downloadUrl)
    if (!Array.isArray(doc.relatedLetterSlugs) || !doc.relatedLetterSlugs.every(s => typeof s === 'string' && /^[a-z0-9-]+$/.test(s))) throw new Error('Invalid guide relation')
    for (const lang of ['en', 'he', 'ru', 'uk'])
      for (const field of ['title', 'summary'])
        if (typeof doc.translations?.[lang]?.[field] !== 'string' || !doc.translations[lang][field].trim()) throw new Error(`Missing ${lang}/${field}`)
  }
  return manifest
}

export async function fetchOfficial(input, { format, fetchImpl = fetch, maxBytes = 8 * 1024 * 1024, timeoutMs = 20000, expectedMarker } = {}) {
  let current = officialUrl(input)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let httpStatus = null
  try {
    for (let hops = 0; hops <= 4; hops++) {
      const response = await fetchImpl(current.href, {
        redirect: 'manual', signal: controller.signal,
        headers: { 'User-Agent': 'Mikhtav-public-catalog/1.0 (+https://mikhtav.vercel.app)', Accept: format === 'pdf' ? 'application/pdf' : 'text/html' },
      })
      httpStatus = response.status
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location')
        await response.body?.cancel()
        if (!location || hops === 4) throw new Error('Invalid or excessive redirects')
        current = officialUrl(new URL(location, current).href)
        continue
      }
      if (!response.ok) { await response.body?.cancel(); throw new Error(`HTTP ${response.status}`) }
      const declared = Number(response.headers.get('content-length'))
      if (declared > maxBytes) { await response.body?.cancel(); throw new Error('Response exceeds size limit') }
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Empty response')
      const chunks = []
      let size = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > maxBytes) { await reader.cancel(); throw new Error('Response exceeds size limit') }
        chunks.push(value)
      }
      const bytes = Buffer.concat(chunks)
      const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() ?? ''
      let observedTitle = null
      if (format === 'pdf') {
        if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-' || !bytes.subarray(-2048).includes(Buffer.from('%%EOF')) || !['application/pdf', 'application/octet-stream'].includes(contentType))
          throw new Error('Response is not a complete PDF original')
      } else {
        const html = bytes.toString('utf8')
        if (contentType !== 'text/html' || !/<(?:html|!doctype html)[\s>]/i.test(html)) throw new Error('Response is not HTML')
        observedTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g, ' ').trim() ?? null
        const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
        if (!observedTitle || !expectedMarker || !visible.includes(expectedMarker) || /^(access denied|request rejected|just a moment|error|login)/i.test(observedTitle))
          throw new Error('Expected public document content was not found')
      }
      return { bytes, sha256: createHash('sha256').update(bytes).digest('hex'), httpStatus,
        contentType: format === 'pdf' ? 'application/pdf' : contentType, finalUrl: current.href,
        observedTitle, sourceLastModified: response.headers.get('last-modified') }
    }
  } catch (error) {
    const result = new Error(error.name === 'AbortError' ? 'Request timed out' : error.message)
    result.httpStatus = httpStatus
    throw result
  } finally { clearTimeout(timer) }
}

export function changeStatus(previous, current) {
  if (!current) return 'unavailable'
  if (!previous) return 'new'
  return previous.sha256 === current.sha256 ? 'unchanged' : 'changed'
}
