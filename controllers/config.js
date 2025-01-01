const mongoose = require('mongoose')
const Services = require('../database/config')

module.exports = {
    createService: async ( req, res) => {
        try {
            const { token, path, url,  methods} = req.body

            const service = new Services({
                token: token,
                url: url,
                path: path,
                methods: methods
            })
            await service.save()
            console.log(service)
            res.status(201).json({data: 'Service created successfully'})
        } catch (error) {
            res.status(500).json({error: error.message})     
        }
    },
    listServices: async (req, res) => {
        try {
            const { token } = req.body
            const query = { token: token}
    
            const services = await Services.find(query)
    
            console.log(services)
            res.json({data: services})
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    },
    deleteService: async (req, res) => {
        try {
            const { token, url, path } = req.body

            const query = {
                token: token,
                url: url,
                path: path
            }
            const result = await Services.findOneAndDelete(query);
            if (result) {
                res.json({ message: 'Service deleted successfully', result });
            } else {
                res.status(404).json({ message: 'Service not found' });
            }

        } catch (err) {
            res.status(500).json({error: err.message})
        }
    },
    updateService: async (req, res) => {
        try {
            const { token, path, url, newPath, newUrl } = req.body 

            const query = {}
            if(token) query.token = token
            if(path) query.path = path
            if(url) query.url = url

            const update = {}
            if(newPath) update.path = newPath
            if(newUrl) update.url = newUrl

            const options = { new: true }

            const updatedService = await Services.findOneAndUpdate(query, update, options);

            if(updatedService) {
                res.json({ message: 'Service updated successfully', updatedService });
            } else {
                res.status(404).json({ message: 'Service not found' });
            }
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }   
}