const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    let sum = 0
    for (let i = 0; i < 1000000; i++) {
      sum += i
    }
    res.send('ok')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});