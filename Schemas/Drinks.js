"use strict";

import mongoose  from "mongoose";

/**
 * Schema and Model operations for Drinks
 */
class Drinks {

    static Schema;
    static Model;
    static collectionName = "drinks";

    static {
        /** IIFE: Init the Schema */
        (function initSchema() {
            const schemaDefintion = {
                category: {type: String, required: true},
                name: {type: String, required: true, unique: true},
                description: {type: String},
                basePrice: {type: Number},
                sizes: [  // if !null, sizes override the basePrice
                    {
                        name: {type: String, required: true}, 
                        price: {type: Number, required: true}
                    }
                ],
                timeRanges: [
                    {
                        day: Number,      // from [1, 2, 3, 4, 5, 6, 7]   each number corresponds to a day of the week, starting Monday
                        startAt: String,  // format: HH:MM  24h
                        endAt: String     // format: HH:MM  24h
                    }
                ]
            }

            Drinks.Schema = new mongoose.Schema(schemaDefintion);

            Drinks.Schema.set("toJSON", {
                transform: (document, returnedObj) => {
                    delete returnedObj.__v
                }
            });
        })();

        /** IIFE: Init the Model */
        (function initModel() {
            Drinks.Model = mongoose.model(Drinks.collectionName, Drinks.Schema);
        })(); 
    }

    static getAll() {
        return Drinks.Model
            .find({})
            .sort({category: "asc", name: "asc"});
    }

    static getOne(_id) {
        return Drinks.Model.findOne({ _id });
    }

    static postOne(data) {
        return (new Drinks.Model(data)).save();
    }

    static putOne(_id, data) {
        return Drinks.Model.findByIdAndUpdate(_id, data);
    }

    static deleteOne(_id) {
        return Drinks.Model.findByIdAndRemove(_id);
    }
}

export default Drinks;
