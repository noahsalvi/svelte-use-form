# Workflow to publish to npm

All commands are run from the repository root.

## Stable release

- Run `npm version [patch/minor/major]` (or update `package.json` manually if you do not want an automatic git tag/commit).
- Run `npm run package`.
- Run `npm publish`.

## Prerelease (beta/alpha)

- Run `npm version [major/minor/patch]-[beta/alpha].0 --no-git-tag-version` (example: `npm version 3.0.0-beta.0 --no-git-tag-version`).
- Run `npm run package`.
- Run `npm publish --tag beta` (or `--tag alpha`).

## Notes

- If publishing fails with 2FA errors, publish with OTP: `npm publish --tag <tag> --otp=<6-digit-code>`.
- If using auth tokens, ensure the token has publish permissions (and bypass-2FA publish capability when required by npm policy).
