const latencies = [];

function addLatency(latencyMs) {
    latencies.push(latencyMs);
    if(latencies.length > 1000){
        latencies.shift();
    }
}

function getPercentiles() {
    const sorted = [...latencies].sort((a, b) => a - b)
    return {
        p50: sorted[Math.floor(sorted.length * 0.50)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)]
    }
} 
module.exports = {
    latencies,
    getPercentiles,
    addLatency
}