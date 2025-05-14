# I Want The Hoodie! 👕

A Cloudflare Worker that monitors the availability of the [Syntax FM Hoodie](https://sentry.shop/products/syntax-hoodie) and sends Telegram notifications when it becomes available in your desired size.

## What's This For?

The Syntax FM podcast merch (especially the hoodies) was sold out quckly after the first drop. This project helps you get notified immediately when your preferred size becomes available, giving you a better chance to snag one before they're gone!

## How It Works

This worker:

1. Runs every 15 minutes via a cron trigger
2. Checks the Syntax shop website for the availability of a hoodie in your specified size (currently set to check for size M)
3. Sends you a Telegram notification when:
   - The hoodie is available in your size ✅
   - The item being monitored is not found 🚫
   - (Does not notify when the item is found but not available)

## Setup

### Prerequisites

- A Cloudflare account (free tier works fine)
- A Telegram bot token and chat ID

### Configuration

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your secrets in Cloudflare:
   ```
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   npx wrangler secret put TELEGRAM_TOPIC_ID
   ```

### Deployment

Deploy to Cloudflare Workers:

```
npx wrangler deploy
```

## Customization

- Change the URL in `wrangler.jsonc` to monitor a different product
- Modify the size in line 21 of `index.ts` (should have done another variable for this...)
- Modify the check interval by changing the cron expression in `wrangler.jsonc`
- Adjust the notification logic in `index.ts` to suit your preferences

## Why This Exists

Because missing out on limited edition merch from your favorite podcast is no fun! This project is a playful way to use modern web technologies to solve a real (albeit first-world) problem.
