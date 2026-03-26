export default function TestForm({ config, onConfigChange, onStart, onStop, isRunning }) {
    return (
        <form>
            <div className="form-group">
                <label htmlFor="targetUrl">Target URL:</label>
                <input 
                    type="text" 
                    id="targetUrl" 
                    name="targetUrl" 
                    value={config.targetUrl} 
                    onChange={e => onConfigChange('targetUrl', e.target.value)} 
                    required 
                />
                <label htmlFor="initialRps">Initial RPS:</label>
                <input 
                    type="number" 
                    id="initialRps" 
                    name="initialRps" 
                    value={config.initialRps} 
                    onChange={e => onConfigChange('initialRps', e.target.value)} 
                    required 
                />
                <label htmlFor="concurrency">Concurrency:</label>
                <input 
                    type="number" 
                    id="concurrency" 
                    name="concurrency" 
                    value={config.concurrency} 
                    onChange={e => onConfigChange('concurrency', e.target.value)} 
                    required 
                />
                <label htmlFor="duration">Duration (seconds):</label>
                <input 
                    type="number" 
                    id="duration" 
                    name="duration" 
                    value={config.duration} 
                    onChange={e => onConfigChange('duration', e.target.value)} 
                    required 
                />
                <label htmlFor="rampStep">Ramp Step:</label>
                <input 
                    type="number" 
                    id="rampStep" 
                    name="rampStep" 
                    value={config.rampStep} 
                    onChange={e => onConfigChange('rampStep', e.target.value)} 
                    required 
                />
                <label htmlFor="maxRps">Max RPS:</label>
                <input 
                    type="number" 
                    id="maxRps" 
                    name="maxRps" 
                    value={config.maxRps} 
                    onChange={e => onConfigChange('maxRps', e.target.value)} 
                    required 
                />
            </div>
            
            <button type="button" onClick={isRunning ? onStop : onStart}>
                {isRunning ? 'Stop Test' : 'Start Test'}
            </button>
            
        </form>
    );
}