const express = require('express')
const app = express()
const PORT = 2000 

app.use(express.json())


app.get('/mock-data', (req, res) => {
    res.json({ message: "mock GET response from mock service"})
})

app.post('/mock-data', (req, res) => {
    res.json({ message: "mock POST response from mock-service"})
})

app.listen(PORT, () => {
    console.log(`Service is running on http://localhost:${PORT}`)
})