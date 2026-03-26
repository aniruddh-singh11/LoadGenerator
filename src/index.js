const app = require('./api');
const { initDb } = require('./db');

async function start() {
    await initDb();
    app.listen(8080, () => {
        console.log('Load generator api is running on port 8080');
    });
}

start();