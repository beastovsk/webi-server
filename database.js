const { Pool } = require('pg')

const pool = new Pool({
    user:"postgres",
    password:"Calvin6448",
    host:"localhost",
    port:5432,
    database: "ecomdb"
})

pool.connect((err) => {
    if (err) throw err
    console.log("Connect to PostgreSQL successfully!")
})

module.exports = pool