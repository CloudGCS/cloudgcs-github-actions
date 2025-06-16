# 🛠️ Build MC Plugin GitHub Action

## Overview

**Build MC Plugin** is a custom GitHub Action that builds a Mission Controller (.NET) plugin, zips the compiled output, and uploads it as a GitHub Actions artifact.

It is designed to work seamlessly with GitHub-hosted NuGet packages and is useful in CI/CD pipelines where .NET-based MC plugins need to be compiled and released.

---

## Inputs

| Name              | Description                                                                               | Required |
| ----------------- | ----------------------------------------------------------------------------------------- | -------- |
| `mc_path`         | Path to the Mission Controller plugin directory (where `dotnet restore` will be executed) | ✅ Yes   |
| `mc_csproj_path`  | Path to the `.csproj` file of the MC plugin (relative to the repository root)             | ✅ Yes   |
| `project_name`    | Name of the project. Used to name the generated ZIP artifact                              | ✅ Yes   |
| `github-username` | GitHub username used to authenticate with the GitHub NuGet feed                           | ✅ Yes   |
| `github-token`    | GitHub token or personal access token used for NuGet authentication                       | ✅ Yes   |

---

## Outputs

| Name            | Description                                             |
| --------------- | ------------------------------------------------------- |
| `artifact_name` | The name of the uploaded artifact (e.g., `MyPlugin-mc`) |

---

## What It Does

1. **Sets up .NET 8 SDK** for the build process
2. **Adds GitHub Packages** as a NuGet source using your GitHub credentials
3. **Restores dependencies** with `dotnet restore`
4. **Builds the plugin** using `dotnet build`
5. **Zips the output** into `project_name-mc.zip`
6. **Uploads the ZIP** as an artifact to the workflow run

---

## Example Usage

```yaml
jobs:
  build-mc:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Mission Controller Plugin
        uses: CloudGCS/cloudgcs-github-actions/plugin-release/build-mc@v1
        with:
          mc_path: 'plugins/MC.MyPlugin'
          mc_csproj_path: 'plugins/MC.MyPlugin/MC.MyPlugin.csproj'
          project_name: 'MyPlugin'
          github-username: 'CloudGCS'
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Use artifact name
        run: echo "Uploaded artifact name: ${{ steps.build-mc.outputs.artifact_name }}"
```
