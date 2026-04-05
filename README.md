# Bayse Cockpit

A personal trading dashboard for [Bayse Markets](https://bayse.markets) — Africa's largest prediction market. Built for crypto market scalping and swing entries, consolidating live spot prices, Bayse market probabilities, and divergence alerts into a single browser-based tool.

---

## What it does

- **Live spot prices** — BTC, ETH, SOL streamed directly from Bayse's Binance feed via WebSocket, with session % change and sparklines
- **Bayse market tracker** — auto-fetches all active crypto prediction markets, renders YES/NO probability in real time
- **Divergence alerts** — flags when spot moves sharply but Bayse probability hasn't repriced yet; that lag is the entry window
- **Live activity feed** — every filled buy/sell order across subscribed markets as it happens
- **Portfolio panel** — open positions and unrealised P&L, refreshed every 30 seconds

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML/CSS/JS — no framework, no build step |
| Data (spot) | `wss://socket.bayse.markets/ws/v1/realtime` |
| Data (markets) | `wss://socket.bayse.markets/ws/v1/markets` |
| Data (portfolio) | `GET https://relay.bayse.markets/v1/pm/portfolio` |
| Deployment | Vercel |

All WebSocket connections are unauthenticated. The public API key is used only for the portfolio REST call.

---

## Project structure

```
bayse-cockpit/
└── index.html    # entire app — setup screen + cockpit in one file
```

---

## Setup

**1. Get your Bayse API key**

Log into [Hoppscotch](https://hoppscotch.io) or [Reqbin](https://reqbin.com) and make two requests:

```
POST https://relay.bayse.markets/v1/user/login
Content-Type: application/json

{ "email": "your@email.com", "password": "yourpassword" }
```

Copy the `token` and `deviceId` from the response, then:

```
POST https://relay.bayse.markets/v1/user/me/api-keys
Content-Type: application/json
x-auth-token: <token>
x-device-id: <deviceId>

{ "name": "Bayse Cockpit" }
```

Save the `publicKey` (`pk_live_...`) and `secretKey` (`sk_live_...`) immediately. The secret key is shown once.

**2. Deploy**

Upload `index.html` to a GitHub repo and connect it to [Vercel](https://vercel.com). No configuration needed.

**3. Launch**

Open your Vercel URL, paste your `pk_live_` key into the setup screen, hit Launch.

---

## Divergence logic

When a spot tick exceeds **2.5%** in a single update, the engine checks all related Bayse crypto markets. If the YES probability hasn't moved in the same direction, it fires an alert. The threshold is adjustable via `DIV_THRESHOLD` in `index.html`.

```js
const DIV_THRESHOLD = 0.025; // 2.5% spot move triggers divergence check
```

---

## Notes

- Personal use only — not intended for public distribution
- Bayse API rate limits login to 1 request per 2 minutes; session tokens should be cached
- Portfolio panel requires a valid public key; all other panels run without authentication
- WebSocket connections auto-reconnect on drop with a 3 second delay

---

## API reference

Full Bayse Markets API documentation: [docs.bayse.markets](https://docs.bayse.markets)
