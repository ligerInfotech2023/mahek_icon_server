const mongoose = require('mongoose')

const dbConn = mongoose
.connect(process.env.dbUrl, {useNewUrlParser: true, useUnifiedTopology:true})
.then(() => {
    console.log("Connected to MongoDB")
  }).catch((err) => {
    console.error('Database connection error: ',err)
  })

module.exports = dbConn;