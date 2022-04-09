"use strict";

import mongoose from "mongoose";
import defaults from "./config.js";
import Foods from "./Schemas/Foods.js";
import Drinks from "./Schemas/Drinks.js";
import RestaurantMenus from "./Schemas/RestaurantMenus.js";

const schemas = {
    [defaults.foodsUri]: Foods,
    [defaults.drinksUri]: Drinks,
    [defaults.menusUri]: RestaurantMenus
}

/**
 * Manage the connection to mongoDB.
 */
class MongoManager {

    connect = () => {
        mongoose.connect(
            defaults.mongoUri,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }
        );
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "Problem connecting to mongoDB"));
    }
    
    disconnect = () => {
        mongoose.disconnect();
    }

    schemaGetAll = (endpoint, request, response, next) => {
        schemas[endpoint]
            .getAll()
            .then(found => response.json(found))
            .catch(err => next(err))
    }

    schemaGetOne = (endpoint, request, response, next) => {
        schemas[endpoint]
            .getOne(request.params.id)
            .then(found => found ? response.json(found) : response.status(404).end())
            .catch(err => next(err));
    }

    schemaPostOne = (endpoint, request, response, next) => {
        schemas[endpoint]
            .postOne(request.body)
            .then(posted => response.json(posted))
            .catch(err => next(err));
    }

    schemaPutOne = async (endpoint, request, response, next) => {
        const _id = request.params.id
        const exists = await schemas[endpoint].getOne(_id);
        if (exists) {
            schemas[endpoint]
                .putOne(_id, request.body)
                .then(edited => response.json(edited))
                .catch(err => next(err));
        } else {
            request.body._id = _id;
            this.schemaPostOne(endpoint, request, response, next);
        }
    }

    schemaDeleteOne = (endpoint, request, response, next) => {
        schemas[endpoint]
            .deleteOne(request.params.id)
            .then(deleted => deleted ? response.status(204).end() : response.status(404).end())
            .catch(err => next(err));
    }
}

export default MongoManager;