const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    token: { type: String, required: true },
    url: { type: String, required: true },
    path: { type: String, required: true },
    methods: { type: [String], default: ["GET", "POST"] },
})

const services = mongoose.model('service', serviceSchema)

module.exports = services