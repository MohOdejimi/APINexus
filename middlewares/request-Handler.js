const axios = require('axios');
const Service = require('../database/config');

const requestHandler = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        const query = {
            token: token,
            path: req.path
        }

        const service = await Service.findOne(query);
        console.log(req.path)
        
        console.log(service)
        
        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }
        
        // Construct the target URL
        const targetUrl = `${service.url}${req.path}`
        console.log(targetUrl)

        // Forward the request to the target service
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: new URL(service.url).host 
            }
        });

        res.status(response.status).json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({
            message: "Internal Server Error",
            error: err?.response?.data || err.message
        });
    }
};

module.exports = requestHandler;