# 🚀 Pre Setup for Plugin Release

## Overview

The **Pre Setup for Plugin Release** GitHub Action is designed to prepare and validate plugin release environments for both **Mission Controller (MC)** and **Pilot Station (PS)** components. It ensures that:

- Required paths are set based on the plugins to be released.
- Plugin versions are matched across components.
- Plugin names are consistent.
- Changelog file is verified if Slack notifications are enabled.

This action is typically used at the beginning of a release pipeline to ensure consistency across plugin builds.

---

## Inputs

| Name             | Description                                                           | Required |
| ---------------- | --------------------------------------------------------------------- | -------- |
| `notify-slack`   | Whether to validate and prepare changelog path for Slack notification | ✅ Yes   |
| `include_mc`     | Whether to include the Mission Controller plugin in the release       | ✅ Yes   |
| `include_ps`     | Whether to include the Pilot Station plugin in the release            | ✅ Yes   |
| `ps_path`        | Path to the Pilot Station plugin (if included)                        | ❌ No    |
| `mc_path`        | Path to the Mission Controller plugin (if included)                   | ❌ No    |
| `mc_csproj_path` | Path to the Mission Controller `.csproj` file (if included)           | ❌ No    |

---

## Outputs

| Name                        | Description                                                                |
| --------------------------- | -------------------------------------------------------------------------- |
| `change_log_file_full_path` | Full path to the changelog file (e.g., `change-logs/1.2.3/change-log.txt`) |
| `plugin_name`               | Plugin name extracted from `.csproj` or `package.json`                     |
| `version`                   | Version of the plugin (must match between MC and PS if both included)      |

---

## Key Features

- ❗ Validates required inputs based on included components (MC/PS)
- 🧠 Extracts plugin version using [`get-project-version`](../get-project-version)
- 🔐 Validates that MC and PS plugin versions and names match
- 📄 Generates expected changelog path (for Slack notifications)
- ❌ Fails fast if misconfigurations or mismatches are found

---

## Example Usage

```yaml
jobs:
  setup-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Pre Setup for Plugin Release
        id: pre-setup
        uses: CloudGCS/cloudgcs-github-actions/plugin-release/pre-setup-plugin-release@v1
        with:
          notify-slack: true
          include_mc: true
          include_ps: true
          mc_path: "plugins/MC.MyPlugin"
          mc_csproj_path: "plugins/MC.MyPlugin/MC.MyPlugin.csproj"
          ps_path: "plugins/PS.MyPlugin"

      - name: Use extracted outputs
        run: |
          echo "Version: ${{ steps.pre-setup.outputs.version }}"
          echo "Plugin:  ${{ steps.pre-setup.outputs.plugin_name }}"
          echo "Change Log File: ${{ steps.pre-setup.outputs.change_log_file_full_path }}"
```
