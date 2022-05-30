"use strict";

import mongoose from "mongoose";
import config from "./config.js";
import Foods from "./Schemas/Foods.js";
import Drinks from "./Schemas/Drinks.js";
import Orders from "./Schemas/Orders.js";
import RestaurantMenus from "./Schemas/RestaurantMenus.js";
import Users from "./Schemas/Users.js";

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

    schemaGetAll = async (endpoint, request, response, next) => {
        try {
            const found = await schemas[endpoint].getAll();
            return response.json(found);
        } catch (err) {
            next(err);
        }
    };

    schemaGetOne = async (endpoint, request, response, next) => {
        try {
            const found = await schemas[endpoint].getOne(request.params.id);
            return found ? response.json(found) : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

    schemaPostOne = async (endpoint, request, response, next) => {
        try {
            const posted = await schemas[endpoint].postOne(request.body);
            return response.json(posted);
        } catch (err) {
            next(err);
        }
    };

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

    schemaDeleteOne = async (endpoint, request, response, next) => {
        try {
            const deleted = await schemas[endpoint].deleteOne(request.params.id);
            return deleted ? response.status(204).end() : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

    drinksGroupedByCategory = async (request, response, next) => {
        try {
            const drinks = await Drinks.getAllCategorized();
            return response.json(drinks);
        } catch (err) {
            next(err);
        }
    };

    deletePastMenus = (request, response, next) => {
        try {
            const todaysDate = (new Date()).toISOString().split("T")[0];
            const deleted = RestaurantMenus.Model.deleteMany({date: {$lt: todaysDate}})
            return deleted ? response.status(204).end() : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

    orderByTable = async (request, response, next) => {
        try {
            const orders = await Orders.Model.findOne({ table: request.params.id });
            return orders ? response.json(orders) : response.status(404).end();
        } catch (err) {
            next(err);
        }
    };

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