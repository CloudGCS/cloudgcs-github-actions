 # Plugin Release Workflow

This workflow builds and releases Mission Controller (MC) and Pilot Station (PS) plugins. It supports building one or both plugins and publishing a GitHub release with artifacts.

---

## Workflow Trigger

- Manual trigger via `workflow_dispatch`.
- Input:
  - `notify-slack` — Enable Slack notifications (choice: `true`/`false`, default: `true`). Ensure a change log file exists with the version number under the `change-logs` directory when enabling notifications.

---

## Environment Variables (defaults)

| Variable         |  Description                                    |
| ---------------- |  ---------------------------------------------- |
| `include_mc`     |  Whether to include the MC plugin in the build. |
| `include_ps`     |  Whether to include the PS plugin in the build. |
| `ps_path`        |  Path to the Pilot Station plugin.              |
| `mc_path`        |  Path to the Mission Controller plugin.         |
| `mc_csproj_path` |  Path to the Mission Controller `.csproj` file. |

---

## Jobs

### Pre-Setup and Validation

- Runs pre-release validation and sets outputs used by downstream jobs.
- Outputs include: `include_ps`, `include_mc`, `plugin_version`, `plugin_name`, and `change_log_file_full_path`.
- See [pre-setup/README.md](pre-setup/README.md).

### Build PowerShell Plugin (PS)

- Runs when `include_ps` is `true` (set via env or pre-setup output).
- Uses: `plugin-release/build-ps@1.0-plugin-release/build-ps`.
- Produces a PS artifact name output used by the publish step.
- See [build-ps/README.md](build-ps/README.md).

### Build Management Console Plugin (MC)

- Runs when `include_mc` is `true`.
- Uses: `plugin-release/build-mc@1.1-plugin-release/build-mc` (passes `version` from pre-setup).
- Produces an MC artifact name output used by the publish step.
- See [build-mc/README.md](build-mc/README.md).

### Publish Release

- Publishes a GitHub release with available artifacts. Conditional logic ensures publish runs only after successful or skipped builds as appropriate.
- Uploads the change log to the release when available.
- Uses: `plugin-release/publish-release@1.0-plugin-release/publish-release`.
- See [publish-release/README.md](publish-release/README.md).

### Notify Slack Channel

- Optionally sends a Slack notification when `notify-slack` is `true` and the publish step succeeds.
- Uses: `slack-notification@1.0-slack-notification` and requires `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_ID` secrets.

---

## Secrets

- `PASSWORD` and `USERNAME` — used for MC build authentication when building MC.
- `GITHUB_TOKEN` — used for GitHub release publishing and upload.
- `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_ID` — required for Slack notifications.

---

## Notes

- Workflow supports building MC only, PS only, or both.
- Pre-setup validates plugin versions and resolves the change log file used by notifications and release uploads.

---

## Usage Example

- See the sample workflow at `plugin-release/sample.yaml` for a ready-to-use `workflow_dispatch` example.

- What the sample covers (summary):
  - Input: `notify-slack` (choice `true`/`false`, default `true`).
  - Default env values: `include_mc: false`, `include_ps: true`, empty plugin paths.
  - Key jobs: `pre-setup` (validates and sets outputs), `build-ps` (PS artifact), `build-mc` (MC artifact — uses `version`), `publish-release` (creates release and uploads changelog), and optional `notify-slack`.

Refer to [sample.yaml](sample.yaml) for the exact workflow and step wiring.
