# 🧩 Build PS Plugin GitHub Action

## Overview

**Build PS Plugin** is a custom GitHub Action that builds a Pilot Station (PS) plugin, typically a React-based frontend application. After building, it uploads the compiled `.js` output as an artifact.

This action simplifies continuous delivery for front-end plugin code and is ideal for systems where PS plugins are deployed independently.

---

## Inputs

| Name           | Description                                    | Required |
| -------------- | ---------------------------------------------- | -------- |
| `ps_path`      | Path to the Pilot Station plugin directory     | ✅ Yes   |
| `project_name` | Name of the project (used for artifact naming) | ✅ Yes   |

---

## Outputs

| Name            | Description                                             |
| --------------- | ------------------------------------------------------- |
| `artifact_name` | The name of the uploaded artifact (e.g., `MyPlugin-ps`) |

---

## What It Does

1. **Sets up Node.js (v20)** for the build environment
2. **Installs dependencies** using `yarn install`
3. **Builds the plugin** using a custom `yarn action-build` command
4. **Uploads the final `.js` build artifacts** as a GitHub Actions artifact

> 🔧 Ensure your project has a `yarn action-build` script defined in `package.json` (e.g., a specialized production or plugin build step).

---

## Example Usage

```yaml
jobs:
  build-ps:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Pilot Station Plugin
        uses: CloudGCS/cloudgcs-github-actions/plugin-release/build-ps@v1
        with:
          ps_path: 'plugins/PS.MyPlugin'
          project_name: 'MyPlugin'

      - name: Use artifact name
        run: echo "Uploaded artifact name: ${{ steps.build-ps.outputs.artifact_name }}"
```
