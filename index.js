require('dotenv').config({path: './configs/.env'})

const express = require('express')
const axios = require('axios')
const app = express()
const requestHandler = require('./middlewares/request-Handler')

//Config DB
const connectDB = require('./configs/db')
connectDB()

// Routes Implementation
const configRoutes = require('./routes/config')

//Middlewares
app.use(express.json())
app.use('/config', configRoutes)

app.all('/*', requestHandler)

app.listen(process.env.PORT || 2121 , () => {
    console.log(`API Gateway is running on http://localhost:2121`)
})