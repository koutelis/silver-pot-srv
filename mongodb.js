'use strict';

const mongoose = require('mongoose');
const { global_variables } = require('./config');
const url = global_variables.url;
const { Foods } = require('./Schemas/Foods.js');
const { Drinks } = require('./Schemas/Drinks.js');

/**
 * Manage the connection to mongoDB.
 */
class MongoManager {
    connect = async () => {
        await mongoose.connect(
            url,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }
        );
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Problem connecting to mongoDB'));
        console.log("connected to mongoDB");
    }
    
    disconnect = async () => {
        mongoose.disconnect();
        console.log("disconnected from mongoDB");
    }
}

module.exports = { MongoManager, Foods, Drinks }