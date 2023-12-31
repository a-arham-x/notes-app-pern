const {Pool} = require("pg")

const client = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })

client.connect(()=>{
      console.log("Connected to Postgresql database")
})

module.exports = client;