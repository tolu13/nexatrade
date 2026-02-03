NexaTrade

NexaTrade is a real-time crypto trading platform built for demonstration and portfolio purposes. It simulates a live trading exchange like Binance or Bitget, featuring a trading engine, live WebSocket updates, candlestick charts, portfolio management, and order tracking.

🔹 Features

Authentication & Authorization

JWT-based login

Protected REST and WebSocket routes

User session management

Trading Engine

Limit and market orders

Buy/Sell matching

Order status tracking (OPEN, PARTIAL, FILLED)

Trades generation and logging

Live Market Data (WebSocket)

Real-time prices per trading pair

Order book updates

Trade matched notifications

Portfolio & Dashboard

Portfolio summary with balances and asset logos

BTC/USDT equivalent calculation

Inspired by professional exchanges

Candlestick Charts

OHLC candles using Chart.js and chartjs-chart-financial

Real-time updates from live market feed

Time-based x-axis and price y-axis

Earn / Yield Section

Placeholder for staking or earning features

Dashboard-ready for future financial products

Transactions (Planned / Partial)

Tracks user orders and trades

Can be extended for full order history

Full-Stack Tech

Backend: NestJS + Prisma + PostgreSQL

Frontend: React + Zustand + Chart.js

Realtime: Socket.IO for live updates

Deployment: Docker-ready

🛠️ Installation
# Clone the repo
git clone https://github.com/yourusername/nexatrade.git
cd nexatrade

# Install dependencies
npm install

# Set up environment variables (.env)
# e.g., DATABASE_URL, JWT_SECRET, etc.

# Start backend + frontend
npm run start:dev

🖥️ Usage

Dashboard: View portfolio summary, market pairs, and candlestick charts.

Markets: Monitor live market data with order books.

Earn: Placeholder for future yield/staking feature.

Transactions: View user orders and trades (future implementation).

All live prices are updated via WebSocket for real-time accuracy.

⚡ Architecture Overview
Frontend (React + Zustand) <-> WebSocket (Socket.IO) <-> Backend (NestJS + Prisma)


Frontend: Manages state and UI updates, connects to WebSocket for real-time feeds.

Backend: Handles orders, trades, and authentication. Matches orders and emits events.

Database: PostgreSQL stores users, orders, trades, and trading pairs.

📈 Future Improvements

Full transactions history page

Multi-timeframe candlestick charts

Integration with real exchange APIs

Staking/Earn feature implementation

Deployment to cloud with proper DB connection

🛡️ Notes

This is a demo project for portfolio and learning purposes.

No real trading occurs; balances and trades are simulated.

Designed to demonstrate full-stack, real-time trading systems.

👨‍💻 Tech Stack

Frontend: React, TypeScript, Zustand, Chart.js

Backend: NestJS, Prisma, PostgreSQL

Realtime: Socket.IO

Deployment: Docker-ready, Vercel/Render compatible