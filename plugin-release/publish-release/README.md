# Publish Release

## Overview

This composite GitHub Action automates creating a GitHub Release for Mission Controller (MC) and/or Pilot Station (PS) plugins by:

- Validating required inputs
- Creating an installation directory
- Downloading the plugin artifacts built earlier in the workflow
- Uploading all artifacts as release assets to GitHub Releases with a version tag

---

## Inputs

| Name                   | Description                                           | Required |
| ---------------------- | ----------------------------------------------------- | -------- |
| `include_mc`           | Whether to include the Mission Controller plugin      | ✅ Yes   |
| `include_ps`           | Whether to include the Pilot Station plugin           | ✅ Yes   |
| `version`              | Version string used as the release tag and version    | ✅ Yes   |
| `github_token`         | GitHub token with permissions to create releases      | ✅ Yes   |
| `ps_plugin_build_name` | Artifact name for the Pilot Station plugin build      | ❌ No    |
| `mc_plugin_build_name` | Artifact name for the Mission Controller plugin build | ❌ No    |

---

## Outputs

| Name                | Description                                        |
| ------------------- | -------------------------------------------------- |
| `installation_path` | Path to the folder containing downloaded artifacts |

---

## Details

- The action verifies that if include_mc or include_ps are true, the corresponding plugin artifact build names must be provided.

- Downloads the plugin artifacts using actions/download-artifact@v4.

- Creates a GitHub Release with the provided version tag.

- Uploads all files inside the created installation directory to the release as assets.

- The release description includes the current date.

---

## Notes

- Make sure that artifacts with the given build names have been uploaded earlier in the workflow.

- The action uses the popular svenstaro/upload-release-action under the hood.

- github_token should be a personal access token or the default GITHUB_TOKEN with repo permissions

---

## Usage Example

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Publish Release
        uses: CloudGCS/cloudgcs-github-actions/publish-release@v1
        with:
          include_mc: true
          include_ps: true
          version: 1.2.3
          github_token: ${{ secrets.GITHUB_TOKEN }}
          mc_plugin_build_name: myplugin-mc
          ps_plugin_build_name: myplugin-ps
```
