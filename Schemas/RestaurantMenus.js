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

        //////////////////
        // Init the Schema
        const schemaDefintion = {
            _id: {type: String},
            date: {type: String},
            fontSize: {type: Number},
            foods: {},
            drinks: {}
        }

        RestaurantMenus.Schema = new mongoose.Schema(schemaDefintion);

        RestaurantMenus.Schema.set("toJSON", {
            transform: (document, returnedObj) => {
                delete returnedObj.__v
            }
        });

        /////////////////
        // Init the Model
        RestaurantMenus.Model = mongoose.model(RestaurantMenus.collectionName, RestaurantMenus.Schema);
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
