const { getPercentiles } = require('./metrics');

function startRamp(tokenBucket, getPercentiles, {rampStep, maxRps}) {
  let lastRampP50 = null;
  let printSaturation = true;
  let saturated = false;

  const rampInterval = setInterval(() => {
    if(saturated){
        return;
    }
    const { p50 } = getPercentiles();

    
    if(lastRampP50 === null){
        lastRampP50 = p50
        tokenBucket.ratePerSecond += rampStep
        console.log(`ramping up to ${tokenBucket.ratePerSecond} RPS`)
        return
    }
    if(lastRampP50 !== null){
        console.log(`p50: ${p50.toFixed(2)} lastRampP50: ${lastRampP50.toFixed(2)} diff: ${(p50 - lastRampP50).toFixed(2)} threshold: ${(lastRampP50).toFixed(2)}`)
    }
    if (tokenBucket.ratePerSecond >= maxRps) {
        console.log(`Reached MAX_RPS: ${maxRps}`)
        saturated = true;
        return
    }
    if(p50 - lastRampP50 < lastRampP50 ){
        tokenBucket.ratePerSecond += rampStep;
        lastRampP50 = p50;
        console.log(`ramping up to ${tokenBucket.ratePerSecond} RPS`)
    }else{
        if(printSaturation){
            printSaturation = false;
            console.log(`Saturation detected at ${tokenBucket.ratePerSecond} RPS`)
            console.log(`Max Sustainable RPS: ${tokenBucket.ratePerSecond - rampStep} RPS`)
            tokenBucket.ratePerSecond -= rampStep;
            console.log(`ramping down to ${tokenBucket.ratePerSecond} RPS`)
            saturated = true;
        }
    }
  
  }, 10000)
  return rampInterval;
}

module.exports = {
    startRamp
}