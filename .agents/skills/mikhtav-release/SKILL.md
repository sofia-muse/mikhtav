---
name: mikhtav-release
description: Validate and release Mikhtav's public React catalog on its existing Vercel project after content or feature changes.
---

Use the existing Vercel team `team_gK6rT9GEFTI1HLZRkIhel2U6`, project `prj_1BMVq0XKTxDa8LgMXzrCSWXRUNuN`, root `src/web`. Verify those identities before release. Follow the user's current release scope; inspection alone does not authorize publication.

For Git deployments pass the repo and commit, retaining project rootDirectory src/web; do not apply that prefix twice. Prefer the authenticated Vercel connector.

From the repo root run `node tools/verify-catalog.mjs`, `npm --prefix src/web run test:run` and `npm --prefix src/web run build`, plus affected backend tests when shared projection changes. Check catalog search with Hebrew/no-match queries and the finder with a selected heading, no recognized heading and category reset. Check detail pages, checklist persistence, printing, glossary and four language directions. Test direct route refresh on the deployment.

Retain Vercel protection settings. The production alias `https://mikhtav.vercel.app` has been accessible anonymously; check current behavior rather than disabling protection. Do not change unrelated Life RPG resources.

For official-library changes also run `node --test tools/official/transport.test.mjs` and `node tools/official/verify.mjs`. Verify `/documents`, a related-letter filter, an unavailable source and one cached PDF checksum. Keep `/official/` out of SPA rewrites so JSON/PDF requests are not replaced by index.html. Do not re-fetch sources during every Vercel build: deploy the verified committed snapshot.

Publish the tested commit, inspect READY state and verify actual deployed content. Report the URL, commit, tests and any unverified behavior. Do not claim legal or translation review from automated checks.
