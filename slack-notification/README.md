# 🔔 Slack Notification GitHub Action

## Overview

**Slack Notification** is a custom GitHub Action that sends a Slack message when a new version of your project is released. It can:

- Generate a release URL automatically or use a custom one
- Read a changelog file and include its content in the message
- Post a rich, formatted message to a specific Slack channel

This is ideal for notifying your team about deployments, releases, or major version updates directly in Slack.

---

## Inputs

| Name                        | Description                                                              | Required |
| --------------------------- | ------------------------------------------------------------------------ | -------- |
| `change-log-file-full-path` | Full path to the changelog file to include in the message                | ✅ Yes   |
| `version`                   | The version of the release                                               | ✅ Yes   |
| `slack-channel-id`          | The Slack channel ID where the message will be sent                      | ✅ Yes   |
| `slack-bot-token`           | Slack bot token with permission to send messages                         | ✅ Yes   |
| `release-name`              | Optional custom release URL (defaults to GitHub tag URL if not provided) | ❌ No    |

---

## How It Works

1. **Prepare the release link**:

   - If `release-name` is provided, it's used as the release URL.
   - If not, it constructs a GitHub release URL based on the version.

2. **Read the changelog file**:

   - Reads and escapes the file content for use in the Slack message.

3. **Send the Slack message**:
   - Posts a formatted message with:
     - Repository name
     - Version info
     - Release link
     - Changelog content

---

## Example Usage

```yaml
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Notify Slack
        uses: CloudGCS/cloudgcs-github-actions/slack-notification-action@v1
        with:
          change-log-file-full-path: "./CHANGELOG.md"
          version: "v1.0.0"
          slack-channel-id: "C12345678"
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
          release-name: "https://your.project.release/link"
```
