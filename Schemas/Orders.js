"use strict";

import mongoose  from "mongoose";

/**
 * Schema and Model operations for Orders
 */
 class Orders {

    static Schema;
    static Model;
    static collectionName = "orders";

    static {

        //////////////////
        // Init the Schema
        const foodsSubdocument = new mongoose.Schema({
            foodId: {type: "ObjectId", required: true},
            category: {type: String, required: true},
            name: {type: String, required: true},
            description: {type: String},
            totalPrice: {type: Number, required: true},  // basePrice + addons prices - removables prices
            basePrice: {type: Number, required: true},
            addons: [
                {
                    name: {type: String, required: true}, 
                    price: {type: Number, required: true}  // extra cost (added to basePrice)
                }
            ],
            removables: [
                {
                    name: {type: String, required: true}, 
                    price: {type: Number, required: true}  // discount (subtracted from basePrice)
                }
            ],
            posDirections: {type: String}, 
            comments: {type: String},
            complete: {type: Boolean, required: true}
        });

        const drinksSubdocument = new mongoose.Schema({
            drinkId: {type: "ObjectId", required: true},
            category: {type: String, required: true},
            name: {type: String, required: true},
            description: {type: String},
            totalPrice: {type: Number, required: true},  // COALESCE(size price, basePrice)
            basePrice: {type: Number, required: true},
            size: {  // if !null, overrides the basePrice
                name: {type: String, required: true},
                price: {type: Number, required: true}
            },
            posDirections: {type: String}, 
            comments: {type: String},
            complete: {type: Boolean, required: true}
        })

        const schemaDefintion = {
            date: {type: String, required: true},
            time: {type: String, required: true},
            table: {type: String, required: true},
            foods: [foodsSubdocument],
            drinks: [drinksSubdocument],
            totalCost: {type: Number, required: true},
            kitchenComplete: {type: Boolean},
            barComplete: {type: Boolean},
            paymentComplete: {type: Boolean}
        }

        Orders.Schema = new mongoose.Schema(schemaDefintion);

        Orders.Schema.set("toJSON", {
            transform: (document, returnedObj) => {
                delete returnedObj.__v
            }
        });

        /////////////////
        // Init the Model
        Orders.Model = mongoose.model(Orders.collectionName, Orders.Schema);
    }

    static getAll() {
        return Orders.Model
            .find({date: todayAsString()})
            .sort({time: "asc"});
    }

    static getOne(_id) {
        return Orders.Model.findOne({ _id });
    }

    static getByTable(tableNum) {
        return Orders.Model.findOne({ table: tableNum, date: todayAsString() });
    }

    static postOne(data) {
        return (new Orders.Model(data)).save();
    }

    static putOne(_id, data) {
        return Orders.Model.findByIdAndUpdate(_id, data);
    }

    static deleteOne(_id) {
        return Orders.Model.findByIdAndRemove(_id);
    }
}

function todayAsString() {
    let dt = new Date();
    const tzDiffHours = dt.getTimezoneOffset() / 60;
    dt.setHours(dt.getHours() - tzDiffHours);
    return dt.toISOString().split("T")[0];
}

export default Orders;