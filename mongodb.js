"use strict";

import mongoose from "mongoose";
import config from "./config.js";
import Foods from "./Schemas/Foods.js";
import Drinks from "./Schemas/Drinks.js";
import Orders from "./Schemas/Orders.js";
import RestaurantMenus from "./Schemas/RestaurantMenus.js";
import Users from "./Schemas/Users.js";

// Map of: API URI to mongo schema
const schemas = {
    [config.foodsUri]: Foods,
    [config.drinksUri]: Drinks,
    [config.ordersUri]: Orders,
    [config.menusUri]: RestaurantMenus,
    [config.usersUri]: Users
};

/**
 * Manage the connection to mongoDB.
 */
class MongoManager {

    connect = () => {
        mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = mongoose.connection;
        db.on(
            "error",
            console.error.bind(console, "Error connecting to mongoDB")
        );
    };

    disconnect = () => {
        mongoose.disconnect();
    };

    /**
     * GET request for the base API URL.
     * @returns {Promise}
     */
    baseGet = async (request, response, next) => {
        try {
            return response.json(true);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Delegate GET responsibilities to the relevant schema 
     * according to the given endpoint (see 'schemas' object refs).
     * Expect multiple "rows" (mongo objects).
     * @returns {Promise}
     */
    schemaGetAll = async (endpoint, request, response, next) => {
        try {
            const found = await schemas[endpoint].getAll();
            return response.json(found);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Delegate GET responsibilities to the relevant schema 
     * according to the given endpoint (see 'schemas' object refs).
     * Expect a single "row" (mongo object).
     * @returns {Promise}
     */
    schemaGetOne = async (endpoint, request, response, next) => {
        try {
            const found = await schemas[endpoint].getOne(request.params.id);
            return found ? response.json(found) : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

    /**
     * Delegate POST responsibilities to the relevant schema
     * according to the given endpoint (see 'schemas' object refs).
     * Function expects a single document object to insert into a mongo collection.
     * @returns {Promise}
     */
    schemaPostOne = async (endpoint, request, response, next) => {
        try {
            const posted = await schemas[endpoint].postOne(request.body);
            return response.json(posted);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Delegate PUT responsibilities to the relevant schema
     * according to the given endpoint (see 'schemas' object refs).
     * Function expects a single document object to update in a mongo collection.
     * @returns {Promise}
     */
    schemaPutOne = async (endpoint, request, response, next) => {
        try {
            const _id = request.params.id;
            const exists = await schemas[endpoint].getOne(_id);

            if (exists) {
                const edited = await schemas[endpoint].putOne(_id, request.body);
                return response.json(edited);
            } else {
                request.body._id = _id;
                return this.schemaPostOne(endpoint, request, response, next);
            }
        } catch (err) {
            next(err);
        }
    };

    /**
     * Delegate DELETE responsibilities to the relevant schema
     * according to the given endpoint (see 'schemas' object refs).
     * Function expects a single document object to permanently delete from a mongo collection.
     * @returns {Promise}
     */
    schemaDeleteOne = async (endpoint, request, response, next) => {
        try {
            const deleted = await schemas[endpoint].deleteOne(request.params.id);
            return deleted ? response.status(204).end() : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

    /**
     * Fetch all documents from the Drinks collection, grouped by category.
     * @returns {Promise}
     */
    drinksGroupedByCategory = async (request, response, next) => {
        try {
            const drinks = await Drinks.getAllCategorized();
            return response.json(drinks);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Delete everything from the menu collection that precedes the current day.
     * @returns {Promise}
     */
    deletePastMenus = (request, response, next) => {
        try {
            const todaysDate = (new Date()).toISOString().split("T")[0];
            const deleted = RestaurantMenus.Model.deleteMany({date: {$lt: todaysDate}})
            return deleted ? response.status(204).end() : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

    /**
     * GET request for the order that has been placed,
     * for a restaurant table as denoted by its id.
     * @returns {Promise}
     */
    orderByTable = async (request, response, next) => {
        try {
            const orders = await Orders.Model.findOne({ table: request.params.id });
            return orders ? response.json(orders) : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

    /**
     * Set listeners for the given socket, in a Pub-Sub pattern.
     * When changes happen to DB, the sockets will emit messages to subscribers.
     * @param {Object} socket - socket.io
     */
    setSocket = (socket) => {
        Orders.Model.watch().on("change", () => {
            socket.emit("ordersUpdated");
        });

        RestaurantMenus.Model.watch().on("change", () => {
            socket.emit("menuUpdated");
        });

        Users.Model.watch().on("change", () => {
            socket.emit("usersUpdated");
        });
    };

    /**
     * Run only if the restaurant menu template is lost or corrupted.
     */
    async _restoreTemplate() {
        // grab the first food from each category and convert to object
        const fetchedFoods = await Foods.getAllCategorized();
        const foods = {};
        fetchedFoods.forEach((elem) => (foods[elem._id] = [elem.items[0]]));

        // convert all drinks from array to object
        const fetchedDrinks = await Drinks.getAllCategorized();
        const drinks = {};
        fetchedDrinks.forEach((elem) => (drinks[elem._id] = elem.items));

        RestaurantMenus.Model.postOne({
            _id: "template",
            date: null,
            foods,
            drinks,
        });
    }
}

export default MongoManager;