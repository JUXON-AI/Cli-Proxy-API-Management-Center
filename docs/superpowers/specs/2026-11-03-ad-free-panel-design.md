# Ad-free management panel and image

## Intent

Remove commercial promotions from the management application shown by the user, audit both source repositories, fork them into JUXON-AI, and publish a replacement Linux/amd64 image to the existing Aliyun skfskf registry. Token accounting was reported first, as requested.

## Scope

- Start from the running panel release v1.27.2 (f154fa9380825c4fe94bc577a9abaa7e505f8875) and backend v8.0.44 (1f917e77c4562623aa49e9804d999524151a2f96).
- Remove campaign banners, affiliate registration links, proxy recommendations, promoted quick-start navigation, promotional locale strings, and unused advertising assets.
- Preserve provider configuration and OAuth login capabilities, API contracts, authentication, hash routing, and the single-file panel artifact.
- Preserve copyright and license notices. Network service discovery terminology is not advertising.
- Build the panel into the replacement image. Default panel download and fallback origins must use the organization fork, so upstream advertising cannot silently replace it.
- Build and test on JX-LAN; publish to registry.cn-hangzhou.aliyuncs.com/skfskf. No VPS deployment or main-branch merge is included.
- Credentials, runtime configuration, auth files, and session/token evidence remain outside the repositories and image build contexts.

## Approach

Make source changes in fresh, isolated clones on cc/ branches. Remove the promotional UI rather than hiding it with CSS or patching the generated HTML. Keep existing generic provider forms available. Redirect the promotion-only quick-start route to the providers workbench. Render Kimi login through the ordinary provider tiles instead of a privileged sponsor placement.

Fork both owning repositories. Build the frontend at an exact reviewed revision and package its management.html alongside the backend. Keep the upstream inference implementation unchanged; only panel-update defaults and image packaging change in the backend fork.

## Verification

Use the existing Bun test/lint/type/build workflow, focused advertisement regression checks, a full compiled-asset scan, Go configuration/management-asset tests and build, and a container smoke test with synthetic credentials only. Check missing/wrong keys, authenticated management routes, panel presence, and image contents. Do not call an inference model: the Antigravity 5-hour quota is exhausted. Browser automation is excluded by the workspace instruction; report that live browser acceptance remains with the user.

## Delivery

Provide fork/branch or PR URLs, exact revisions, image tag/digest, verification outcomes, and limitations. Preserve the working VPS and JX-LAN tunnel.
