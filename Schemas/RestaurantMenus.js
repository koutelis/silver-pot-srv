"use strict";

import mongoose  from "mongoose";

/**
 * Schema and Model operations for the restaurant menu template
 */
 class RestaurantMenus {

    static Schema;
    static Model;
    static collectionName = "restaurantmenus";

    static {

        /** IIFE: Init the Schema */
        (function initSchema() {
            const schemaDefintion = {
                _id: String,
                date: String,
                fontSize: Number,
                items: {}
            }

            RestaurantMenus.Schema = new mongoose.Schema(schemaDefintion);

            RestaurantMenus.Schema.set("toJSON", {
                transform: (document, returnedObj) => {
                    delete returnedObj.__v
                }
            });
        })();

        /** IIFE: Init the Model */
        (function initModel() {
            RestaurantMenus.Model = mongoose.model(RestaurantMenus.collectionName, RestaurantMenus.Schema);
        })(); 
    }

    static getOne(_id) {
        return RestaurantMenus.Model.findOne({ _id });
    }

    static postOne(data) {
        return (new RestaurantMenus.Model(data)).save();
    }

    static putOne(_id, data) {
        return RestaurantMenus.Model.findByIdAndUpdate(_id, data);
    }
}

export default RestaurantMenus;
