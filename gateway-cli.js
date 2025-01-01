#!/usr/bin/env node
require('dotenv').config({path: './configs/.env'})

const { Command } = require('commander')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const program = new Command()
const apiBaseUrl = 'http://localhost:2121' //apiNexus

function pathResolve(path) {
    if (!path) {
        return null;
    }
    let servicePath = path 
    if (servicePath.startsWith('C:/Program Files/Git/')) {
        servicePath = servicePath.replace('C:/Program Files/Git', '');
    }
    servicePath = servicePath.replace(/\\/g, '/');
    return (servicePath) ? servicePath : null
}

program 
        .command('create-token')
        .description('Create a jwt token')
        .action(async () => {
            try {
                let clientId = uuidv4();
                const payload = { id: clientId };
                const secretKey = process.env.secret;
    
                if (!secretKey) {
                    throw new Error('Secret key is not defined. Please set the secretkey environment variable.');
                }
    
                const token = jwt.sign(payload, secretKey);
                console.log(token);
                console.log('Token created successfully. Store it for future use.');
            } catch (err) {
                console.error('Error creating token:', err.message);
            }
        });
  
program 
        .command('create-service')
        .description('Create a new service')
        .requiredOption('--url <url>', 'Service url')
        .requiredOption('--path <path>', 'Unique key for the service')
        .requiredOption('--methods <methods>', 'Comma Seperated HTTP methods for your service (e.g.,GET, POST)  ')
        .requiredOption('--token <token>', 'JWT token for the service')    
        .action(async (options) => {
            try {
                const methods =options.methods.split(',').map(method => method.trim().toUpperCase())
                const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
                const invalidMethods = methods.filter(method => !allowedMethods.includes(method))

                if(invalidMethods.length > 0) {
                    throw new Error(`Invalid HTTP methods: ${invalidMethods.join(', ')}. Valid HTTP methods: ${allowedMethods.join(', ')}.`)
                }

                let servicePath = options.path;

                if (servicePath.startsWith('C:/Program Files/Git/')) {
                    servicePath = servicePath.replace('C:/Program Files/Git', '');
                }

                servicePath = servicePath.replace(/\\/g, '/');

                const response = await axios.post(`${apiBaseUrl}/config/service`, {
                    token: options.token,
                    path: servicePath,
                    url: options.url,
                    methods
                })

                console.log('Service created:', response.data)
            } catch (err) {
                console.error('Error creating service:', err.response?.data || err.message)
            }
        })

          
program
        .command('list-services')
        .description('List all configured services')
        .requiredOption('--token <token>', 'JWT token for the service')
        .action(async (options) => {
            try {
                const response = await axios.post(`${apiBaseUrl}/config/list-services`, {
                    token: options.token
                })
                console.log(response.data)
            } catch (err) {
                console.error('Error listing services:', err.response?.data || err.message)
            }
        })      
        
program
        .command('delete-service')
        .description('Delete a service')
        .requiredOption('--token <token>', 'JWT token for the service')
        .requiredOption('--url <url>', 'Service url')
        .requiredOption('--path <path>', 'Unique key for the service')
        .action(async (options) => {
            try {
                let servicePath = options.path;

                if (servicePath.startsWith('C:/Program Files/Git/')) {
                    servicePath = servicePath.replace('C:/Program Files/Git', '');
                }

                servicePath = servicePath.replace(/\\/g, '/');

                const response = await axios.delete(`${apiBaseUrl}/config/service`, {
                    data: {
                        token: options.token,
                        url: options.url,
                        path: servicePath
                    }    
                })
                console.log(response.data)
            } catch (err) {
                console.error('Error deleting service:', err.response?.data || err.message)
            }
        })   
        
program
        .command('update-service')
        .description('Update a backend service')
        .requiredOption('--token <token>', 'JWT token for the service')
        .option('--path <path>', 'Path of service to update')
        .option('--newPath <newPath>', 'New Path for the service')
        .option('--url <url>', 'Url of service to update')
        .option('--newUrl <newUrl>', 'New Url for the service')
        .action(async (options) => {
            try {
                if (!options.path && !options.url) {
                    throw new Error('Please provide either --path or --url of the service to update.');
                }
                if (!options.newPath && !options.newUrl) {
                    throw new Error('Please provide either --newPath or --newUrl for the service.');
                }
    
                const payload = {
                    token: options.token,
                };
                if (options.path) payload.path = pathResolve(options.path);
                if (options.url) payload.url = options.url;
                if (options.newPath) payload.newPath = pathResolve(options.newPath);
                if (options.newUrl) payload.newUrl = options.newUrl;
    
                const response = await axios.put(`${apiBaseUrl}/config/service`, payload);
    
                console.log('Service has been updated', response.data);
            } catch (error) {
                console.error(error.response?.data || error.message || error);
            }
        });
          
program
        .command('test-route')
        .description('Test a specific route')
        .requiredOption('--path <path>', 'Path to test routing')
        .action(async (options) => {
            try {
                const response = await axios.post(`${apiBaseUrl}/test-route`, {
                    path: options.path,
                })
                console.log('Route test response:', response.data)
            } catch (err) {
                console.error('Error testing route:', err.response?.data || err.message)
            }
        })   
        
program.parse(process.argv)        