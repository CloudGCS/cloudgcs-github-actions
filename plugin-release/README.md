# Plugin Release Workflow

This workflow builds and releases Mission Controller (MC) and Pilot Station (PS) plugins. It supports building one or both plugins and publishing a GitHub release with artifacts.

---

## Workflow Trigger

- Manual trigger via `workflow_dispatch`.
- Input:
  - `notify-slack` (boolean) — enables Slack notifications (requires changelog file).

---

## Environment Variables

| Variable         | Description                                    |
| ---------------- | ---------------------------------------------- |
| `include_mc`     | Whether to include MC plugin in the build.     |
| `include_ps`     | Whether to include PS plugin in the build.     |
| `ps_path`        | Path to the Pilot Station plugin.              |
| `mc_path`        | Path to the Mission Controller plugin.         |
| `mc_csproj_path` | Path to the Mission Controller `.csproj` file. |

---

## Jobs

### 1. Pre-Setup

- [Pre-Setup Documentation](./pre-setup/README.md)

### 2. Build PS Plugin

- Set the `include_ps` is `true` if your reposityor includes pilot station plugin
- [Build PS Plugin Documentation](./build-ps/README.md)

### 3. Build MC Plugin

- Set the `include_mc` is `true` if your reposityor includes mission controller plugin
- [Build MC Plugin Documentation](./build-mc/README.md)

### 4. Publish Release

- [Publish Release Documentation](./publish-release/README.md)

---

## Secrets

- `PASSWORD` and `USERNAME` for MC build authentication.
- `GITHUB_TOKEN` for GitHub release publishing.

---

## Notes

- Supports building MC only, PS only, or both.
- Validates version consistency between MC and PS plugins.
- Requires changelog file if Slack notifications enabled.

---

## Usage Example

```yaml
name: Release Test Workflow

on:
  workflow_dispatch:
    inputs:
      notify-slack:
        description: "Please set this to true to enable Slack notifications. Ensure that a change log file is created with version number under the change-logs directory"
        required: true
        default: "true"

env:
  include_mc: true
  include_ps: true
  ps_path: VideoStream-UIPlugin
  mc_path: VideoStream-MCPlugin/MC.Plugin.VideoStream
  mc_csproj_path: VideoStream-MCPlugin/MC.Plugin.VideoStream/MC.Plugin.VideoStream.csproj

jobs:
  pre-setup:
    runs-on: ubuntu-latest
    outputs:
      include_ps: ${{ steps.set-vars.outputs.include_ps }}
      include_mc: ${{ steps.set-vars.outputs.include_mc }}
      plugin_version: ${{ steps.pre-setup.outputs.version }}
      plugin_name: ${{ steps.pre-setup.outputs.plugin_name }}
      change_log_file_full_path: ${{ steps.pre-setup.outputs.change_log_file_full_path }}

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set Variables
        id: set-vars
        run: |
          echo "include_ps=${{ env.include_ps }}" >> $GITHUB_OUTPUT
          echo "include_mc=${{ env.include_mc }}" >> $GITHUB_OUTPUT
      - name: Pre Setup Checks for Plugin Release
        id: pre-setup
        uses: CloudGCS/cloudgcs-github-actions/plugin-release/pre-setup@1.0-plugin-release/pre-setup
        with:
          include_mc: ${{ env.include_mc }}
          include_ps: ${{ env.include_ps }}
          ps_path: ${{ env.ps_path }}
          mc_path: ${{ env.mc_path }}
          mc_csproj_path: ${{ env.mc_csproj_path }}
          notify-slack: ${{ github.event.inputs.notify-slack }}

  build-ps-plugin:
    runs-on: ubuntu-latest
    needs: [pre-setup]
    if: ${{ needs.pre-setup.outputs.include_ps == 'true' }}
    outputs:
      artifact_name: ${{ steps.build-and-upload-ps.outputs.artifact_name }}
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Debug Environment Variables
        run: |
          echo "PS Path: ${{ env.ps_path }}"
          echo "Plugin Name: ${{ needs.pre-setup.outputs.plugin_name }}"
      - name: Build and Upload PS Plugin Artifact
        id: build-and-upload-ps
        uses: CloudGCS/cloudgcs-github-actions/plugin-release/build-ps@1.0-plugin-release/build-ps
        with:
          project_name: ${{ needs.pre-setup.outputs.plugin_name }}
          ps_path: ${{ env.ps_path }}

  build-mc-plugin:
    runs-on: ubuntu-latest
    if: ${{ needs.pre-setup.outputs.include_mc == 'true' }}
    needs: [pre-setup]
    outputs:
      artifact_name: ${{ steps.build-and-upload-mc.outputs.artifact_name }}
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Build and Upload MC Plugin Artifact
        id: build-and-upload-mc
        uses: CloudGCS/cloudgcs-github-actions/plugin-release/build-mc@1.0-plugin-release/build-mc
        with:
          project_name: ${{ needs.pre-setup.outputs.plugin_name }}
          mc_path: ${{ env.mc_path }}
          mc_csproj_path: ${{ env.mc_csproj_path }}
          github-token: ${{ secrets.PASSWORD }}
          github-username: ${{ secrets.USERNAME }}

  upload-artifacts:
    runs-on: ubuntu-latest
    needs: [pre-setup, build-ps-plugin, build-mc-plugin]
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name:
        uses: CloudGCS/cloudgcs-github-actions/plugin-release/publish-release@1.0-plugin-release/publish-release
        with:
          include_mc: ${{ needs.pre-setup.outputs.include_mc }}
          include_ps: ${{ needs.pre-setup.outputs.include_ps }}
          ps_plugin_build_name: ${{ needs.build-ps-plugin.outputs.artifact_name }}
          mc_plugin_build_name: ${{ needs.build-mc-plugin.outputs.artifact_name }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          version: ${{ needs.pre-setup.outputs.plugin_version }}
```
