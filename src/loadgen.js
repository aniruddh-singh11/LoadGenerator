const http = require('http');
const { addLatency } = require('./metrics');
const state = require('./state');

function scheduleNext(tokenBucket, TargetUrl) {
    if (!state.running) return
    if (tokenBucket.tryConsume()) {
      sendRequest(tokenBucket, TargetUrl)
    } else {
      setTimeout(() => scheduleNext(tokenBucket, TargetUrl), 10) // wait 10ms and try again
    }
  }

function sendRequest(tokenBucket, TargetUrl){
    const start = process.hrtime.bigint();
    http.get(TargetUrl, (res) => {
        res.resume();
        if(res.statusCode >= 400){
          state.errors++;
        }else{
          const end = process.hrtime.bigint();
          const latencyMs = Number(end - start)/ 1_000_000;
          addLatency(latencyMs);
        }
        state.completed++;
        scheduleNext(tokenBucket, TargetUrl);
    }).on('error', () => {
        scheduleNext(tokenBucket, TargetUrl);
    })

}

module.exports = {
    scheduleNext,
    sendRequest
}