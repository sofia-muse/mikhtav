import { readFileSync, readdirSync } from 'node:fs'
import assert from 'node:assert/strict'
const root = new URL('../src/web/public/catalog/', import.meta.url)
const read = path => JSON.parse(readFileSync(new URL(path, root), 'utf8'))
const nonempty = value => typeof value === 'string' && value.trim().length > 0
const english = read('en/index.json').flatMap(c => c.letters)
const slugs = english.map(l => l.slug).sort()
assert.equal(new Set(slugs).size, slugs.length, 'Duplicate letter slugs')
const locales = ['en', 'he', 'ru', 'uk']
for (const lang of locales) {
  const index = read(`${lang}/index.json`)
  assert.deepEqual(index.flatMap(c => c.letters.map(l => l.slug)).sort(), slugs, `${lang}: index parity`)
  for (const category of index) {
    assert.ok(nonempty(category.name) && nonempty(category.issuer), `${lang}: category translation`)
    for (const summary of category.letters) {
      const detail = read(`${lang}/${summary.slug}.json`)
      assert.equal(detail.translationComplete, true, `${lang}/${summary.slug}: incomplete translation`)
      assert.equal(summary.name, detail.name)
      assert.equal(summary.summary, detail.summary)
      assert.ok(nonempty(detail.name) && nonempty(detail.summary))
      for (const field of ['primaryNextStep', 'appliesWhen', 'recommendedChannel', 'whenToContactAuthority', 'whatToVerify'])
        assert.ok(nonempty(detail.guidance[field]), `${lang}/${summary.slug}: missing ${field}`)
      const base = read(`en/${summary.slug}.json`)
      assert.deepEqual(detail.sections.map(s => [s.order, s.labelHe]), base.sections.map(s => [s.order, s.labelHe]), 'Stable Hebrew section identities')
      assert.ok(detail.sections.every(s => nonempty(s.explainer)))
      assert.equal(summary.hasActionRequired, detail.sections.some(s => nonempty(s.actionRequired)))
      assert.equal(summary.hasDeadline, detail.sections.some(s => nonempty(s.deadline)))
      assert.ok(nonempty(detail.editorial?.version))
      assert.match(detail.editorial.sourceCheckedOn, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(detail.editorial.sources.length > 0)
      for (const source of detail.editorial.sources) {
        const url = new URL(source.url)
        assert.ok(url.protocol === 'https:' && (url.hostname === 'gov.il' || url.hostname.endsWith('.gov.il')))
        assert.ok(nonempty(source.scope) && nonempty(source.title))
        if (lang !== 'en') assert.ok(nonempty(source.scopeTranslations?.[lang]), `${lang}: source scope translation`)
      }
    }
  }
  const glossary = read(`${lang}/glossary.json`)
  assert.deepEqual(glossary.map(t => [t.id, t.termHe]), read('en/glossary.json').map(t => [t.id, t.termHe]))
  assert.ok(glossary.every(t => nonempty(t.meaning)))
  assert.equal(readdirSync(new URL(`${lang}/`, root)).filter(f => f.endsWith('.json')).length, slugs.length + 2, 'Stale/unexpected snapshots')
}
console.log(`Catalog verified: ${slugs.length} letters, ${read('en/glossary.json').length} glossary terms, ${locales.length} complete locales.`)
