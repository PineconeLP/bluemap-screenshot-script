# 📸 BlueMap Screenshot Script

Script to take Minecraft world screenshots through a [BlueMap](https://bluemap.bluecolored.de/) web server and post them to Discord.

## Installation

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
  "regions": [
    {
      "name": "Spawn",
      "views": [
        "https://your-bluemap-host/#overworld:0:100:0:0:0:0:0:0:free",
        "https://your-bluemap-host/#overworld:50:100:50:0:-0.8:0.42:0:0:free"
      ]
    }
  ]
}
```

| Field | Description |
|---|---|
| `renderWaitMs` | Milliseconds to wait for map tiles to render before screenshotting. |
| `regions[].name` | Display name used in the Discord message. |
| `regions[].views` | Array of BlueMap URLs to screenshot for this region. |

## Usage

Run with default config:

```bash
npm start
```

Run with custom config file:

```bash
npm start -- my-config.json
```

## Contributing

Open an issue or pull request if you have any feature ideas or bug fixes!
