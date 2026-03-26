export default function ResultsTable({results}) {
    return (
        <table className="results-table">
            <thead>
                <tr>
                    <th>Started At</th>
                    <th>Target URL</th>
                    <th>P50 Latency</th>
                    <th>P95 Latency</th>
                    <th>P99 Latency</th>
                    <th>Error Rate</th>
                    <th>Max Sustainable RPS</th>
                    <th>Saturation Detected</th>
                </tr>
            </thead>
            <tbody>
                {results.map((result) => (
                    <tr key={result.id}>
                        <td>{result.started_at}</td>
                        <td>{result.target_url}</td>
                        <td>{result.p50}</td>
                        <td>{result.p95}</td>
                        <td>{result.p99}</td>
                        <td>{result.error_rate}</td>
                        <td>{result.max_sustainable_rps}</td>
                        <td>{result.saturation_detected}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}