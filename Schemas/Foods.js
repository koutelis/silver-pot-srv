"use strict";

import mongoose  from "mongoose";

/**
 * Schema and Model operations for Foods
 */
 class Foods {

    static Schema;
    static Model;

    static {

        /** IIFE: Init the Schema */
        (function initSchema() {
            const schemaDefintion = {
                category: {type: String, required: true},
                title: {type: String, required: true, unique: true},
                description: {type: String},
                basePrice: {type: Number, required: true},
                addons: [
                    {
                        name: {type: String, required: true}, 
                        price: {type: Number}  // extra cost (added to basePrice)
                    }
                ],
                removables: [
                    {
                        name: {type: String, required: true}, 
                        price: {type: Number}  // discount (subtracted from basePrice)
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

            Foods.Schema = new mongoose.Schema(schemaDefintion);

            Foods.Schema.set("toJSON", {
                transform: (document, returnedObj) => {
                    delete returnedObj.__v
                }
            });
        })();

        /** IIFE: Init the Model */
        (function initModel() {
            Foods.Model = mongoose.model("foods", Foods.Schema);
        })(); 
    }

    static getAll() {
        return Foods.Model
            .find({})
            .sort({category: "asc", title: "asc"});
    }

    static getOne(_id) {
        return Foods.Model.findOne({ _id });
    }

    static postOne(data) {
        return (new Foods.Model(data)).save();
    }

    static putOne(_id, data) {
        return Foods.Model.findByIdAndUpdate(_id, data);
    }

    static deleteOne(_id) {
        return Foods.Model.findByIdAndRemove(_id);
    }
}

export default Foods;