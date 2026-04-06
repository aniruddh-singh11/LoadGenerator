# Chaos and Load Intelligence Platform

A load testing and chaos engineering platform that generates traffic intelligently, 
injects failures, and automatically identifies system bottlenecks.

## What it does

- Generates controlled HTTP traffic with precise RPS targeting via token bucket algorithm
- Ramps load gradually and automatically detects saturation points
- Tracks latency percentiles (p50, p95, p99) in real time
- Exposes a REST API to start, stop, and monitor tests
- Chaos engine that can delay requests or create errors
- Database that stores all metrics after each run
- Dashboard with live metrics for viewing test results

## What's being built next

- AI layer for autonomous test orchestration

## How to run

Clone the repo and install dependencies:
\```bash
npm install
cd dashboard && npm install
\```

Start all services with Docker Compose:
\```bash
docker compose up --build
\```

This starts:
- Load generator API on port 8080
- Target server on port 3000
- Chaos engine on port 4000
- PostgreSQL on port 5432

Start the dashboard:
\```bash
cd dashboard && npm run dev
\```

Open http://localhost:5173 in your browser.

Trigger a test via API:
\```bash
curl -X POST http://localhost:8080/test/start \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "http://target-server:3000/test", "initialRps": 200, "concurrency": 300, "duration": 60000, "rampStep": 200, "maxRps": 2000}'
\```

## Status

Core platform built — load generation, chaos engine, persistent storage, and dashboard complete. AI orchestration layer coming next.