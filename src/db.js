const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    port: 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'loadgenerator'
})

async function initDb() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS test_results (
            id SERIAL PRIMARY KEY,
            started_at TIMESTAMP,
            completed_at TIMESTAMP,
            target_url TEXT,
            initial_rps INTEGER,
            max_rps INTEGER,
            ramp_step INTEGER,
            concurrency INTEGER,
            duration INTEGER,
            p50 FLOAT,
            p95 FLOAT,
            p99 FLOAT,
            completed_requests INTEGER,
            error_rate FLOAT,
            max_sustainable_rps INTEGER,
            saturation_detected BOOLEAN
        )
    `)
    console.log('Database initialized')
}

async function saveTestResult({startedAt, completedAt, targetUrl, initialRps, maxRps, rampStep, concurrency, duration, p50, p95, p99, completedRequests, errorRate, maxSustainableRps, saturationDetected}){
    try{
        await pool.query(`
            INSERT INTO test_results (started_at, completed_at, target_url, initial_rps, max_rps, ramp_step, concurrency, duration, p50, p95, p99, completed_requests, error_rate, max_sustainable_rps, saturation_detected)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `, [startedAt, completedAt, targetUrl, initialRps, maxRps, rampStep, concurrency, duration, p50, p95, p99, completedRequests, errorRate, maxSustainableRps, saturationDetected])
    } catch (error) {
        console.error('Error saving test result:', error.message)
    }
}

async function getTestResults(){
    const { rows } = await pool.query(`
        SELECT * FROM test_results
    `)
    return rows;
}

module.exports = { pool, initDb, saveTestResult, getTestResults }