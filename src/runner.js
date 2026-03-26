const TokenBucket = require('./tokenBucket');
const { startRamp } = require('./ramp');
const { scheduleNext } = require('./loadgen');
const { getPercentiles, latencies } = require('./metrics');
const { saveTestResult } = require('./db');
const state = require('./state');

function resetState(){
    state.completed = 0;
    state.tokenBucket = null;
    state.errors = 0;
    latencies.length = 0;
    state.maxSustainableRps = null;
    state.saturationDetected = false;
}

function startTest({targetUrl, initialRps, concurrency, duration, rampStep, maxRps}) {
    resetState();
    const startedAt = new Date();
    state.running = true;
    const tokenBucket = new TokenBucket(initialRps);
    state.tokenBucket = tokenBucket;
    const startTime = Date.now();

    const rampInterval = startRamp(tokenBucket, getPercentiles, {rampStep, maxRps});

    for(let i = 0; i < concurrency; i++){
        scheduleNext(tokenBucket, targetUrl); 
    }

    const metricsInterval = setInterval(() =>{
        if(latencies.length > 0){
            const { p50, p95, p99 } = getPercentiles()
            const elapsed =Math.floor((Date.now() - startTime) / 1000);
        
            console.log(`[${elapsed}s] completed: ${state.completed} | errors: ${state.errors} | p50: ${p50.toFixed(2)}ms | p95: ${p95.toFixed(2)}ms | p99: ${p99.toFixed(2)}ms`)
        }
    }, 1000)

    function cleanUp(){
        console.log('Cleaning up...');
        state.running = false;
        clearInterval(metricsInterval);
        clearInterval(rampInterval);
        printResults();
    }
    function printResults(){
        const { p50, p95, p99 } = getPercentiles()
        console.log(`\nCompleted: ${state.completed} requests`)
        console.log(`p50: ${p50.toFixed(2)}ms`)
        console.log(`p95: ${p95.toFixed(2)}ms`)
        console.log(`p99: ${p99.toFixed(2)}ms`)
        saveTestResult({
            startedAt,
            completedAt: new Date(),
            targetUrl,
            initialRps,
            maxRps,
            rampStep,
            concurrency,
            duration,
            p50, p95, p99, completedRequests: state.completed, errorRate: state.errors / state.completed, maxSustainableRps: state.maxSustainableRps, saturationDetected: state.saturationDetected
        })

    }

    state.cleanUp = cleanUp;

    setTimeout(() => {
        state.cleanUp();
    }, duration);
}

function stopTest() {
    state.running = false;
    state.cleanUp();
}

module.exports = { startTest, stopTest };