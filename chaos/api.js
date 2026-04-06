const express = require('express');
const cors = require('cors');
const app = express();
const { setUrl, setLatency, setErrors, clearRules, getRules, handleProxy } = require('./handler');

app.use(cors());
app.use(express.json());

app.post('/target', (req, res) => {
    const { url } = req.body;
    if(!url) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    setUrl(url);
    res.status(200).json({ message: 'Target set' });
})

app.post('/chaos/latency', (req, res) => {
    const { delay, percentage } = req.body;
    if(!delay || !percentage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    setLatency(delay, percentage);
    res.status(200).json({ message: 'Latency set' });
})

app.post('/chaos/errors', (req, res) => {
    const { percentage } = req.body;
    if(!percentage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    setErrors(percentage);
    res.status(200).json({ message: 'Errors set' });
})

app.delete('/chaos/reset', (req, res) => {
    clearRules();
    res.status(200).json({ message: 'Rules reset' });
})

app.get('/chaos/rules', (req, res) => {
    const rules = getRules();
    res.status(200).json(rules);
})

app.all('/{*path}', (req, res) => {
    handleProxy(req, res);
})

module.exports = app;