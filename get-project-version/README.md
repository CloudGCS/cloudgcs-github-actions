# 🔍 Get Project Version GitHub Action

## Overview

**Get Project Version** is a custom GitHub Action that extracts and returns the version of a project by reading the provided version file. It supports:

- `package.json` (Node.js projects)
- `.csproj` files (C# projects)

This is useful in CI/CD pipelines where you need to dynamically fetch the version to use in releases, logs, tagging, etc.

---

## Inputs

| Name                             | Description                                                                | Required |
| -------------------------------- | -------------------------------------------------------------------------- | -------- |
| `project-version-file-full-path` | The full path to the version file (e.g., `package.json`, `Project.csproj`) | ✅ Yes   |

---

## Outputs

| Name      | Description                |
| --------- | -------------------------- |
| `version` | The parsed project version |

---

## Supported File Types

- **`package.json`**: Extracts the value of the `version` field.
- **`.csproj`**:
  - First looks for `<PluginVersion>1.0.0</PluginVersion>`
  - If not found, falls back to `<Version>1.0.0</Version>`

If the input path is not provided or doesn't point to a valid file, the action will automatically search for a `.csproj` file in the current working directory.

---

## Example Usage

```yaml
jobs:
  get-version:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Get Project Version
        id: get-version
        uses: CloudGCS/cloudgcs-github-actions/get-project-version-action@v1
        with:
          project-version-file-full-path: "./src/MyApp/MyApp.csproj"

      - name: Use Version Output
        run: echo "Project version is ${{ steps.get-version.outputs.version }}"
```
