# HMPPS Electronic Monitoring Components

Reusable web components and map utilities for Electronic Monitoring UI applications.

---

## Documentation

**Component usage, demos, and API reference are available in Docs:**

[View the documentation site](https://ministryofjustice.github.io/hmpps-electronic-monitoring-components)

---

## Documentation & Preview Sites (GitHub Actions)

Every branch automatically builds its own **Storybook documentation preview** using GitHub Actions.

- When you **push** a branch, Storybook is built and deployed to GitHub Pages.
- When that branch is **deleted**, the preview site is automatically removed.

### How to check your branch preview

After pushing your branch, wait for the “**Deploy Storybook (docs site)**” GitHub Action to complete.  
You can then access the docs at the URL:

https://ministryofjustice.github.io/hmpps-electronic-monitoring-components/<branch-name>/

For example:

| Branch name          | Docs URL                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `main`               | https://ministryofjustice.github.io/hmpps-electronic-monitoring-components/                    |
| `new-feature`        | https://ministryofjustice.github.io/hmpps-electronic-monitoring-components/new-feature/        |
| `feature/new-map-ui` | https://ministryofjustice.github.io/hmpps-electronic-monitoring-components/feature-new-map-ui/ |

> **When you delete a branch**, the workflow automatically cleans up the corresponding preview directory from GitHub Pages.

---

## Development Setup

```bash
npm install
```

---

## Live test components in Local development

Start the feature development environment:

```bash
npm run start-feature
```

---

## Testing

### Unit tests (Jest)

```bash
npm test
```

Run in CI mode:

```bash
npm run test:ci
```

---

### Integration tests (Cypress)

Component-level integration tests use Cypress Component Testing.

Run headless:

```bash
npm run int-test
```

Run with UI (Chrome):

```bash
npm run int-test:ui
```

---

## Publishing to npm

Publishing is now **fully automated** through GitHub Actions when changes are merged into the `main` branch.

### What happens automatically

When a **pull request is merged into `main`**, the pipeline will:

1. Run linting, type checking, unit tests, and integration tests.
2. Build the library.
3. Check if the version in `package.json` has changed.
   - If it **has changed**, a **Git tag** is automatically created (e.g. `v0.0.7`).
   - If it **has not changed**, the workflow fails — reminding the developer to bump the version before merging.
4. The new tag automatically triggers the **Publish package** workflow, which:
   - Rebuilds the package.
   - Publishes it to npm using **OpenID Connect (OIDC)** authentication — no manual login or tokens required.

---

### To prepare a branch for release

Before creating a PR:

- Manually bump the version in `package.json` using semantic versioning:
  ```bash
  npm version patch   # for bug fixes
  npm version minor   # for backward-compatible features
  npm version major   # for breaking changes
  ```
- Commit and push the updated `package.json` to the feature branch.

When the PR is merged into `main`, the CI/CD workflow will handle tagging and publishing automatically.

---

### 📦 npm package

Once published, the latest version of the package will be available on npm:

```bash
@ministryofjustice/hmpps-electronic-monitoring-components
```

You can view it on [npmjs.com](https://www.npmjs.com/package/@ministryofjustice/hmpps-electronic-monitoring-components)

---

### **Summary**

| Action              | Trigger                          | Output                                                 |
| ------------------- | -------------------------------- | ------------------------------------------------------ |
| **Build & Test**    | Any branch push / PR             | Validates code (lint, types, unit + integration tests) |
| **Docs Preview**    | Any branch push                  | Deploys Storybook preview for the branch               |
| **Docs Publish**    | Merge to `main`                  | Updates documentation on GitHub Pages                  |
| **Version & Tag**   | Merge to `main` with new version | Creates Git tag (vX.Y.Z)                               |
| **Package Publish** | Tag (auto or manual)             | Publishes new npm package version                      |
