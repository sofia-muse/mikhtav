---
name: mikhtav-content
description: Maintain Mikhtav's four-language letter explanations, glossary, official-source provenance, and published catalog snapshots. Use for editorial content and localization changes in this repository.
---

Mikhtav explains common notices; it does not determine eligibility, debt, or legal deadlines for a specific person.

Read `src/Mikhtav.Core/Content/translations.json` for normalized translation records and `provenance.json` for source metadata. Structural identities and Hebrew headings originate in `src/Mikhtav.Infrastructure/Data/SeedData.cs`. `EditorialCatalog` projects translations through `LetterService` for both the API and the static site.

For each affected letter, check the relevant official authority page. Record what that source supports; distinguish a source-access date from expert editorial review. Never infer a fixed deadline from a different notice or label machine translations as independently reviewed. Preserve null actions for informational sections.

For a new letter register LetterType and Sections in SeedData, then add translations and provenance. Bump the letter's editorial version when its actions or section meaning changes, so stale checklist completion is invalidated. Keep EN, HE, RU and UK aligned by slug and section order, including issuer names, guidance, glossary notes and deadlines. Preserve original Hebrew headings. Missing translations must be visibly identified.

From the repository root run `dotnet run --project tools/ExportCatalog -- src/web/public/catalog`, `node tools/verify-catalog.mjs`, `npm --prefix src/web run test:run`, and `npm --prefix src/web run build`. Commit source and generated snapshots together. Do not claim the API was tested when only the static site was tested.
