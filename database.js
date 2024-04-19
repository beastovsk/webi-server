const { Pool } = require('pg')

const pool = new Pool({
    user:"postgres",
    password:"RCbfPvvCtQHdPBsiNZCLbgIYzPIrTGUL",
    host:"roundhouse.proxy.rlwy.net",
    port:15661,
    database: "railway"
})

pool.connect((err) => {
    if (err) throw err
    console.log("Connect to PostgreSQL successfully!")
})

module.exports = pool