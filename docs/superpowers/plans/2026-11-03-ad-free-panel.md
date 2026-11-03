# Ad-free Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove commercial promotions from the management frontend and publish a reproducible image containing that frontend.

**Architecture:** Maintain separate JUXON-AI frontend and backend forks. Build a single-file frontend from the exact cleaned frontend commit, then embed it in a backend image whose panel-update defaults point to the organization fork.

**Tech Stack:** React 19, TypeScript, Vite, Bun 1.4.3, Go 1.26.10+, Docker on JX-LAN.

**Spec:** docs/superpowers/specs/2026-11-03-ad-free-panel-design.md

## Global Constraints

- Preserve provider forms, OAuth login, licenses, and single-file hash routing.
- Do not add dependencies or include runtime secrets.
- Use cc/ branches; do not merge main or deploy to the VPS.
- Build and test on JX-LAN, with bounded build concurrency.
- Publish to registry.cn-hangzhou.aliyuncs.com/skfskf.
- No inference calls or computer use.

## Review Focus

- Provider and Kimi OAuth configuration remain available after registration promotions are removed.
- Previously bookmarked /quick-start routes reach a useful management page.
- All seven locales and generated assets are free of promotional calls to action.
- Panel download failure cannot restore the upstream advertising panel.
- Built images contain the cleaned panel and licenses, but no credentials.

## Task 1: Clean frontend promotions

**Files:** provider/OAuth/config/layout components, sponsor constants and assets, locale files, tests.

**Interfaces:** Consumes current provider/OAuth contracts. Produces a tested frontend commit and dist/index.html.

- [ ] Inspect the owning components and existing tests; record baseline tests on JX-LAN.
- [ ] Add or update focused regressions for plain proxy configuration, promotion-free provider UI, and preserved Kimi OAuth entries; run them against the baseline and observe the expected failures.
- [ ] Remove promotional components, links, strings, and unused assets. Keep provider editing and OAuth flows.
- [ ] Run bun run verify on JX-LAN; scan the single-file build for the known promotional links and campaign text. Expected: full verification passes and no promotional output remains.
- [ ] Commit and push the frontend branch; record the exact commit used for image assembly.

## Task 2: Package and publish the clean image

**Files:** backend panel-update defaults, Dockerfile.adfree, example configuration, README files, focused tests.

**Interfaces:** Consumes the exact frontend commit from Task 1. Produces the backend fork revision and an immutable Linux/amd64 image tag/digest.

- [ ] Add a regression for organization-owned panel update defaults and verify it fails against upstream defaults.
- [ ] Point default release/fallback sources at the organization frontend fork; remove README commercial promotions while retaining attribution.
- [ ] Add a reproducible multistage Dockerfile with the frontend revision pinned. Include management.html and both licenses.
- [ ] Run focused Go tests, the full Go suite and build on JX-LAN. Record unrelated baseline failures separately.
- [ ] Build and smoke-test the image with temporary synthetic keys; validate authentication and management panel delivery without invoking a model.
- [ ] Obtain an independent final review, fix required findings, push branches/PRs, publish the immutable image to Aliyun, and verify the registry digest.
