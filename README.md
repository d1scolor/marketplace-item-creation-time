# Facebook Marketplace Creation Time Finder

A small browser-console script for finding the `creation_time` timestamp of Facebook Marketplace listings when the visible “listed X days/weeks ago” text is missing.

Facebook sometimes hides the listing age in the UI, even though the listing creation timestamp is still present in the Marketplace GraphQL response. This script helps surface that timestamp while you are manually viewing listings in your own browser.

## What it does

When installed in the browser console, the script watches Facebook Marketplace GraphQL responses and looks for Marketplace listing detail payloads containing a field like:

```json
"creation_time": 1775954123
```

It then prints the listing creation time in:

- Unix timestamp format
- Local browser time
- UTC time

## What it does not do

This script does **not**:

- scrape Marketplace at scale
- automatically crawl listings
- bypass Facebook access controls
- call private APIs directly
- modify Facebook data
- send data anywhere

It only inspects responses already loaded in your own browser session.

## Usage

1. Open Facebook Marketplace in your browser.
2. Open DevTools.
3. Go to the **Console** tab.
4. Paste the script.
5. Press Enter.
6. Open a Marketplace listing in the same tab.
7. Check the Console output.

Example output:

```text
Marketplace creation_time found
Title: Apple Magic Keyboard (Touch ID) + Magic Trackpad + Ergo Dock - USB-C
Unix: 1775954123
Local: 11/04/2026, 10:35:23 am
UTC: 2026-04-11T00:35:23.000Z
```

## Manual fallback

If the script does not catch the request, find the timestamp manually:

1. Open DevTools → **Network**.
2. Open a Marketplace listing.
3. Look for `/api/graphql/` requests.
4. Find the request whose variables include:

```json
"targetId": "LISTING_ID_HERE"
```

5. Open the response and search for:

```text
creation_time
```

The usual path is:

```text
data.viewer.marketplace_product_details_page.target.creation_time
```

Convert it with:

```js
new Date(1775954123 * 1000).toLocaleString()
```

or:

```js
new Date(1775954123 * 1000).toISOString()
```

## Notes

Do not confuse `creation_time` with other timestamps:

| Field | Meaning |
|---|---|
| `creation_time` | Actual Marketplace listing creation timestamp |
| `publish_time` | Often an ad/story/post timestamp, not the listing date |
| `request_start_time_ms` | Request timing metadata |
| `time_at_flush_ms` | Request timing metadata |
| `join_time` | Seller account join time |

Requests with these fields are usually not the main listing-detail request:

```text
PDP_RELATED_ADS_FEED
adsRelatedTo
client_mutation_id
has_seen
frx
report_button
```

## Why Facebook sometimes hides the date

Facebook may receive the listing `creation_time` from GraphQL but still choose not to render it in the UI. Based on observed Marketplace frontend code, the listing header can switch between different components depending on delivery, pickup, shipping, or other listing state.

In some cases, the UI renders:

```text
Listed 8 weeks ago in Sydney, NSW
```

In others, it renders only:

```text
Listed in Sydney, NSW
```

even though `creation_time` exists in the response.

## Legal / responsible use

Use this only for manual inspection of listings you are already viewing.

Do not use this script to:

- bulk collect Marketplace data
- crawl listings
- automate account activity
- bypass rate limits
- violate Facebook or Meta terms

## License

MIT
