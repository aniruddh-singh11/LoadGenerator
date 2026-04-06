import { useState, useEffect } from 'react';
export default function ChaosControls() {
    const [latency, setLatency] = useState(0);
    const [latencyPercentage, setLatencyPercentage] = useState(0);
    const [errorRate, setErrorRate] = useState(0);
    const [rules, setRules] = useState({});

    async function applyLatency(){
        await fetch('http://localhost:4000/chaos/latency',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({delay: latency, percentage: latencyPercentage})
        })
        getRules();
    }

    async function applyErrorRate(){
        await fetch('http://localhost:4000/chaos/errors',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({percentage: errorRate})
        })
        getRules();
    }

    async function clearRules(){
        await fetch('http://localhost:4000/chaos/reset',{
            method: 'DELETE',
        })
        getRules();
    }

    async function getRules(){
        const response = await fetch('http://localhost:4000/chaos/rules');
        const data = await response.json();
        console.log(data);
        setRules(data);
    }

    useEffect(() => {
        getRules();
    }, []);

    
    
    return (
        <div>
            <h2>Chaos Controls</h2>
            <div>
                <span>Latency:</span>
                <input type="number" min="0" max="10000" value={latency} onChange={e => setLatency(e.target.value)} />
                <span>Latency Percentage:</span>
                <input type="number" min="0" max="100" value={latencyPercentage} onChange={e => setLatencyPercentage(e.target.value)} />
                <button onClick={applyLatency}>Apply Latency</button>
                <span>Error Rate:</span>
                <input type="number" min="0" max="100" value={errorRate} onChange={e => setErrorRate(e.target.value)} />
                <button onClick={applyErrorRate}>Apply Error Rate</button>
                <button onClick={clearRules}>Clear Rules</button>
            </div>
            <div>
                <p>Rules:</p>
                <ul>
                <li>Latency: {rules.latency ? `${rules.latency.delay}ms at ${rules.latency.percentage * 100}%` : 'None'}</li>
                <li>Error Rate: {rules.errors ? `${rules.errors.percentage * 100}%` : 'None'}</li>
                </ul>
            </div>
        </div>
    )
}