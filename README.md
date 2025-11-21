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

### **Publishing to npm**

- Publishing the library is managed via the **“Publish package”** GitHub Actions workflow.
- It runs automatically when a **new release** is created in GitHub, or can be triggered manually via the **“Run workflow”** button under the **Actions** tab.

To publish a new version:

1. When a pull request is merged into main, the CI pipeline automatically:

- Runs linting, type checking, and all tests.
- Builds the package.
- Increments the version number in package.json (using npm version patch).
- Creates and pushes a Git tag (e.g. v0.0.7).

2. The vX.Y.Z tag automatically triggers the “Publish package” workflow, which:

- Rebuilds the package.
- Publishes it to npm under the MoJ namespace via OpenID Connect (OIDC) authentication.

3. Once complete, the new version will appear on the npm registry under the MoJ namespace:

`@ministryofjustice/hmpps-electronic-monitoring-components`

---

### **Summary**

| Action              | Trigger              | Output                                                 |
| ------------------- | -------------------- | ------------------------------------------------------ |
| **Build & Test**    | Any branch push / PR | Validates code (lint, types, unit + integration tests) |
| **Docs Publish**    | Merge to `main`      | Updates any Docs changes on GitHub Pages               |
| **Package Publish** | Tag (auto or manual) | Publishes to npm if the version is new                 |

---

## Repository structure

| Path                 | Purpose                           |
| -------------------- | --------------------------------- |
| `/src/components`    | Web component source files        |
| `/src/stories`       | Storybook stories and docs        |
| `/integration_tests` | Cypress component tests           |
| `/dist`              | Compiled build output (generated) |
