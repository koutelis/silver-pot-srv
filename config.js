require('dotenv').config()

const global_variables = {
    port: process.env.PORT,
    url : process.env.MONGODB_URI
}

module.exports = { global_variables }
