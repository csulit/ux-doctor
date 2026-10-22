# Releasing

`package.json` `version` is the single source of truth. `npm run build` mirrors it into `.claude-plugin`, `.codex-plugin` and `.cursor-plugin` `plugin.json`; `npm run validate` (and CI) fails if they differ, if the version isn't valid SemVer, or if `CHANGELOG.md` has no `## [x.y.z]` section for it.

## Cut a release

1. Land everything on `main` (CI green).
2. In `CHANGELOG.md`, rename `## [Unreleased]` to `## [x.y.z]` (add the date if you like) and add a fresh empty `## [Unreleased]` above it.
3. Commit that change (`docs: changelog for vX.Y.Z`).
4. `npm version patch|minor|major` — bumps `package.json`, runs build + validate, syncs manifests, commits and tags `vX.Y.Z`.
5. `git push --follow-tags`.

Pushing the tag triggers `.github/workflows/release.yml`: it checks the tag equals `v` + `package.json` version, validates, packs the tarball, attests build provenance, and publishes a GitHub release using that version's changelog section as the notes. Tags containing `-` (e.g. `v1.0.0-rc.1`) are marked pre-release.

Release tags (`v*`) are protected from deletion and force-moves by a repository ruleset, so a published version is immutable. To fix a bad release, ship a new patch.

Verify a downloaded tarball: `gh attestation verify ux-doctor-x.y.z.tgz --repo csulit/ux-doctor`.
