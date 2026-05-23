# BlueMap Screenshot Script

Script to take Minecraft world screenshots through a BlueMap web server.

## Features

- Take screenshots of Minecraft world regions
- Post screenshots to a Discord channel

## Install

1. Pull this repo locally.

```
git clone git@github.com:PineconeLP/bluemap-screenshot-script.git
```

2. Install packages.

```
npm install
```

## Configuration

1. Define a `.env` file in the project root.

```env
# The Discord webhook URL to post screenshots to.
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

> Get a webhook URL from your Discord server: **Server Settings → Integrations → Webhooks → New Webhook**.

2. Configure `config.json` (or pass a custom config file path as the first argument):

```json
{
  "renderWaitMs": 10000,
  "towns": [
    {
      "name": "North Town",
      "views": [
        "https://your-bluemap-host/#world:0:330:-2500:0:0:0:0:0:free",
        "https://your-bluemap-host/#world:100:150:-2400:0:-0.75:0.75:0:0:free"
      ]
    }
  ]
}
```

| Field | Description |
|---|---|
| `renderWaitMs` | Milliseconds to wait for map tiles to render before screenshotting. |
| `towns[].name` | Display name used in the Discord message. |
| `towns[].views` | Array of BlueMap URLs to screenshot for this town. |

## Usage

Run with default config:

```bash
npm start
```

Run with custom env file or config file:

```bash
node --env-file=.env index.js my-config.json
```

## Contributing

Open an issue or pull request if you have any feature ideas or bug fixes!
