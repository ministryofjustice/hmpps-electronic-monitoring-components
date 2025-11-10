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
| `create-docs-site`   | https://ministryofjustice.github.io/hmpps-electronic-monitoring-components/create-docs-site/   |
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

1. Update the package version in `package.json`.
2. Ensure all changes are merged into `main`.
3. Commit and push the version change.
4. Create a **new GitHub Release** (e.g. `v1.3.0`).
5. The workflow will:
   - Install dependencies and run lint, type, and test checks
   - Build the package
   - Publish to npm via OpenID Connect (OIDC), **only if the version is new**

Once complete, the new version will appear on the npm registry under the MoJ namespace:

`@ministryofjustice/hmpps-electronic-monitoring-components`

---

### **Summary**

| Action              | Trigger              | Output                                                 |
| ------------------- | -------------------- | ------------------------------------------------------ |
| **Build & Test**    | Any branch push / PR | Validates code (lint, types, unit + integration tests) |
| **Docs Publish**    | Merge to `main`      | Updates any Docs changes on GitHub Pages               |
| **Package Publish** | GitHub Release       | Publishes new npm package version                      |

---

## Repository structure

| Path                 | Purpose                           |
| -------------------- | --------------------------------- |
| `/src/components`    | Web component source files        |
| `/src/stories`       | Storybook stories and docs        |
| `/integration_tests` | Cypress component tests           |
| `/dist`              | Compiled build output (generated) |
