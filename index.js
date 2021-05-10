const express = require('express')
const app = express()
const config = require('./config')
const mongosse = require('mongoose')
const cors = require('cors')

// 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// 
const userRoutes = require('./routes/user.routes')

// 
app.use('/user', userRoutes)

// 
app.listen(config.port, () => {
    console.log('Magic happens at ', config.port)
})

// 
const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true }
mongosse.connect(config.dbURL, dbConfig, (err) => {
    if (err) {
        console.log('Error connecting db...', err)
        return
    }
    console.log('Connected to database...')
})