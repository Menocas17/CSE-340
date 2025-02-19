const { application } = require('express')
const { Pool } = require ('pg')
require ('dotenv').config()

console.log("Database URL:", process.env.DATABASE_URL);
// Conection Pool
// SSL obkect needed for local testing of app
// But will cause problems in production environment 
// IF - else will make determination which to use

let pool 
if (process.env.NODE_ENV === 'development') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        
        },
    })

    // Added for troubleshooting queries 
    // during development

    module.exports = {
        async query (text, params) {
            try {
                const res = await pool.query(text, params)
                console.log('executed query', {text})
                return res
            }

            catch (error) {
                console.error('errir in query', {text})
                throw error 
            }
        },
    }
} else {
    pool = new Pool ({
        connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}
