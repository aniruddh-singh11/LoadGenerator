import { useState, useEffect } from 'react'
import TestForm from './components/TestForm'
import LiveMetrics from './components/LiveMetrics'
import ResultsTable from './components/ResultsTable'
import ChaosControls from './components/ChaosControls'
//import './App.css'

function App() {
  const [config, setConfig] = useState({
    targetUrl: 'http://target-server:3000/test',
    initialRps: 200,
    concurrency: 300,
    duration: 60000,
    rampStep: 200,
    maxRps: 2000,
  })
  const [metrics, setMetrics] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState([])

  useEffect(() => {
    if(!isRunning) return;
    const interval = setInterval(() => {
      fetch('http://localhost:8080/test/status').
      then(response => response.json())
      .then(data => setMetrics(data))
      .catch(error => console.error('Error fetching metrics:', error))
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    fetch('http://localhost:8080/test/results')
    .then(response => response.json())
    .then(data => setResults(data))
    .catch(error => console.error('Error fetching results:', error))
  }, [])

  async function startTest() {
    await fetch('http://localhost:8080/test/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })
    setIsRunning(true)
  }
  async function stopTest() {
    await fetch('http://localhost:8080/test/stop', {
      method: 'POST',
    })
    setIsRunning(false)
  }
  function handleConfigChange(field, value) {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="app">
      <h1>Load Generator Dashboard</h1>
      <TestForm config={config} onConfigChange={handleConfigChange} onStart={startTest} onStop={stopTest} isRunning={isRunning} />
      <ChaosControls />
      <LiveMetrics metrics={metrics} />
      <ResultsTable results={results} />
    </div>
  )
}

export default App
