export default function LiveMetrics({ metrics }) {
    if (!metrics) return (
        <div>
            <h2>Live Metrics</h2>
            <p>No test running</p>
        </div>
    )
    return (
        <div className="live-metrics">
            <h2>Live Metrics</h2>
            <p>Current RPS: {metrics.rps}</p>
            <p>50th Percentile Latency: {metrics.p50}ms</p>
            <p>95th Percentile Latency: {metrics.p95}ms</p>
            <p>99th Percentile Latency: {metrics.p99}ms</p>
            <p>Completed Requests: {metrics.completed}</p>
            <p>Error Rate: {metrics.errorRate}</p>
        </div>
    )
}