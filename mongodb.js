"use strict";

import mongoose from "mongoose";
import config from "./config.js";
import Foods from "./Schemas/Foods.js";
import Drinks from "./Schemas/Drinks.js";
import Orders from "./Schemas/Orders.js";
import RestaurantMenus from "./Schemas/RestaurantMenus.js";

const schemas = {
    [config.foodsUri]: Foods,
    [config.drinksUri]: Drinks,
    [config.ordersUri]: Orders,
    [config.menusUri]: RestaurantMenus
}

/**
 * Manage the connection to mongoDB.
 */
class MongoManager {

    connect = () => {
        mongoose.connect(
            config.mongoUri,
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

    drinksGroupedByCategory = (request, response, next) => {
        Drinks
            .getAllCategorized()
            .then(found => response.json(found))
            .catch(err => next(err))
    }

    async _restoreTemplate() {
        // grab the first food from each category and convert to object
        const fetchedFoods = await Foods.getAllCategorized();
        const foods = {};
        fetchedFoods.forEach(elem => foods[elem._id] = [elem.items[0]]);

        // convert all drinks from array to object
        const fetchedDrinks = await Drinks.getAllCategorized();
        const drinks = {};
        fetchedDrinks.forEach(elem => drinks[elem._id] = elem.items);

        RestaurantMenus.Model.postOne( { _id: "template", date: null, foods, drinks } );
    }
}

export default MongoManager;