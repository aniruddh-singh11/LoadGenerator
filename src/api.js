const express = require('express');
const app = express();
const state = require('./state');
const { startTest, stopTest } = require('./runner');
const { getPercentiles, latencies } = require('./metrics');
const { getTestResults } = require('./db');

app.use(express.json());

app.post('/test/start', (req, res) => {
    const { targetUrl, initialRps, concurrency, duration, rampStep, maxRps } = req.body;
    if(!targetUrl || !initialRps || !concurrency || !duration || !rampStep || !maxRps) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if(state.running){
        return res.status(409).json({ error: 'Test already running' });
    }
    try{
        startTest({targetUrl, initialRps, concurrency, duration, rampStep, maxRps});
        return res.status(200).json({ message: 'Test started' });
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
})
app.post('/test/stop', (req, res) => {
    if(!state.running){
        return res.status(409).json({ error: 'Test not running' });
    }
    stopTest();
    return res.status(200).json({ message: 'Test stopped' });
})
app.get('/test/status', (req, res) => {
    if(!state.running && latencies.length === 0){
        return res.status(200).json({ message: 'Test not running' });
    }
    const { p50, p95, p99 } = getPercentiles();
    return res.status(200).json({ 
        p50, p95, p99,
        completed: state.completed,
        errorRate: state.completed > 0 ? ((state.errors / state.completed) * 100).toFixed(1) + '%' : '0%',
        running: state.running,
        tokenBucket: state.tokenBucket ? state.tokenBucket.ratePerSecond : 0
    });
})
app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
})
app.get('/test/results', async (req, res) => {
    try {
        const results = await getTestResults()
        return res.status(200).json(results)
    } catch(err) {
        return res.status(500).json({ error: err.message })
    }
})

module.exports = app;