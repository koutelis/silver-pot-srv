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

        /** IIFE: Init the Schema */
        (function initSchema() {
            const schemaDefintion = {
                timestamp: {type: Date, required: true},
                table: {type: String, required: true},
                foods: [
                    {
                        category: {type: String, required: true},
                        name: {type: String, required: true, unique: true},
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
                        comments: {type: String}
                    }
                ],
                drinks: [
                    {
                        category: {type: String, required: true},
                        name: {type: String, required: true, unique: true},
                        description: {type: String},
                        totalPrice: {type: String, required: true},  // COALESCE(size price, basePrice)
                        basePrice: {type: Number, required: true},
                        size: {  // if !null, overrides the basePrice
                            name: {type: String, required: true},
                            price: {type: Number, required: true}
                        }
                    }
                ],
                totalCost: {type: Number, required: true}
            }

            Orders.Schema = new mongoose.Schema(schemaDefintion);

            Orders.Schema.set("toJSON", {
                transform: (document, returnedObj) => {
                    delete returnedObj.__v
                }
            });
        })();

        /** IIFE: Init the Model */
        (function initModel() {
            Orders.Model = mongoose.model(Orders.collectionName, Orders.Schema);
        })(); 
    }

    static getAll() {
        return Orders.Model
            .find({})
            .sort({timestamp: "asc"});
    }

    static getOne(_id) {
        return Orders.Model.findOne({ _id });
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

export default Orders;