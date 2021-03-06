"use strict";

import mongoose  from "mongoose";

/**
 * Schema and Model operations for Foods
 */
 class Foods {

    static Schema;
    static Model;
    static collectionName = "foods";

    static {

        //////////////////
        // Init the Schema
        const schemaDefintion = {
            category: {type: String, required: true},
            name: {type: String, required: true, unique: true},
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
            posDirections: {type: String}, 
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

        /////////////////
        // Init the Model
        Foods.Model = mongoose.model(Foods.collectionName, Foods.Schema);
    }

    static getAll() {
        return Foods.Model
            .find({})
            .sort({category: "asc", name: "asc"});
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

    static getAllCategorized() {
        const sortByName = { $sort: { name : 1 } };
        const group = { $group: { _id: "$category", items: { $push: "$$ROOT" } } };
        const sortByCategory = { $sort: { _id : 1 } };
        return Foods.Model.aggregate([ sortByName, group, sortByCategory ]);
    }
}

export default Foods;
