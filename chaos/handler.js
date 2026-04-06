let TARGET_URL = process.env.TARGET_URL || 'http://target-server:3000'

const chaosRules = {
    "latency": null,
    "errors": null
}

function setUrl(url){
    const parsedUrl = new URL(url);
    TARGET_URL = `${parsedUrl.protocol}//${parsedUrl.host}`
}

function setLatency(delay, percentage){
    chaosRules.latency = {
        delay,
        percentage
    }
}

function setErrors(percentage){
    chaosRules.errors = {
        percentage
    }
}

function clearRules(){
    chaosRules.latency = null
    chaosRules.errors = null
}

function getRules(){
    return chaosRules
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function handleProxy(req, res){
    //console.log(`Forwarding to: ${TARGET_URL}${req.url}`)
    if(chaosRules.errors && Math.random() < chaosRules.errors.percentage){
        res.status(500).send('Internal Server Error')
        return
    }
    if(chaosRules.latency && chaosRules.latency.percentage > Math.random()){
        await sleep(chaosRules.latency.delay)
    }
    const response = await fetch(`${TARGET_URL}${req.url}`, {
        method: req.method,
        headers: req.headers,
        body: req.method === 'GET' ? undefined : JSON.stringify(req.body)
    })

    const body = await response.text()
    res.status(response.status).send(body)

}

module.exports = {
    setLatency,
    setErrors,
    clearRules,
    getRules,
    handleProxy, setUrl
}