# Chaos and Load Intelligence Platform

A load testing and chaos engineering platform that generates traffic intelligently, 
injects failures, and automatically identifies system bottlenecks.

## What it does

- Generates controlled HTTP traffic with precise RPS targeting via token bucket algorithm
- Ramps load gradually and automatically detects saturation points
- Tracks latency percentiles (p50, p95, p99) in real time
- Exposes a REST API to start, stop, and monitor tests

## What's being built next

- Chaos engine (latency injection, connection drops, error injection)
- Persistent metrics storage
- Dashboard for visualizing test results
- AI layer for autonomous test orchestration

## How to run

Clone the repo and install dependencies:
\```bash
npm install
\```

Start the test target server:
\```bash
node server.js
\```

Start the load generator API:
\```bash
node src/index.js
\```

Trigger a test:
\```bash
curl -X POST http://localhost:8080/test/start \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "http://localhost:3000/test", "initialRps": 200, "concurrency": 300, "duration": 60000, "rampStep": 200, "maxRps": 2000}'
\```

## Status

Early stage — load generation engine and API layer complete.