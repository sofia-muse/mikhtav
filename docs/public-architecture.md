# Public application

The Vercel project serves `src/web` as a static Vite application. It never contacts an issuing authority during a build. The existing .NET API is an optional catalog adapter; the public deployment uses committed JSON snapshots.

## Boundaries

- `app`: routing, language synchronisation, error boundary, navigation and footer.
- `features`: letters, finder, documents, glossary, checklist, editorial sources and about. Cross-feature composition uses the checklist/editorial public exports.
- `shared`: catalog contracts and clients, TanStack Query cache, namespace translations, safe language preference storage, UI primitives and design tokens.

Feature styles are CSS Modules. Only reset, typography, focus and token rules are global. Add translations under `shared/i18n/locales/{en,he,ru,uk}/{namespace}.json`.

Letter/glossary clients select static `/catalog/{locale}/…json` by default, or the existing `/api` endpoints when `VITE_API_URL` is set. Official documents always use `/official/documents.json`. Query functions consume AbortSignal; locale and resource identifiers isolate translated cache entries. Cached results remain visible after a background failure.

Language preference: valid URL `lang`, saved choice, first supported browser language, then English. Manual switching preserves current search/filter parameters and stores the preference when browser storage is available. Finder answers stay in component state; checklist keys remain `mikhtav:checklist:v1:{slug}:{editorialVersion}`.

Catalog filters are URL parameters: home `q/issuer/action`; documents `q/kind/issuer/letter`; glossary `q/letter`. `AppLink` carries the current language to internal destinations. Original PDFs open in a separate tab and never pass through the React router.

## Content and previews

`IEditorialCatalog` is injected into the service; the API and static exporter use `EditorialCatalog`. Database-backed index queries include sections so severity, action and deadline signals agree with detail pages.

After an explicit official import, generate previews separately:

```sh
python tools/official/previews.py --pdftoppm /path/to/pdftoppm
node tools/official/verify.mjs
```

Requires Python/Pillow and Poppler. The command reads verified local PDFs, verifies their SHA-256, renders only page one to a 480px-wide WebP and writes optional `preview` metadata. It performs no network requests and leaves source bytes untouched. Preview paths are addressed by the PDF hash; the verifier checks provenance, format and dimensions. Missing previews are valid and receive a document-type placeholder. Do not add preview generation or official import to Vercel builds.

## Release checks

Run frontend tests/build, .NET tests, catalog verification and importer transport tests. Exercise four languages including Hebrew RTL, mobile navigation with Escape/focus return, direct URLs and browser history, finder no-match, checklist persistence/version changes, unavailable sources, preview absence and loading retry. Check widths 360/390/768/1440 and text enlargement before publishing the tested commit. Existing Vercel protection settings must stay unchanged.
