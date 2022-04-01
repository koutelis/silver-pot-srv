const mongoose = require('mongoose');

class Drinks {

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
                size: {             // when a size is !null, implies the regular (basePrice) changes accordingly
                    small: Number,  // negative number to be added to basePrice and produce a lower amount
                    large: Number   // positive number to be added to basePrice
                },
                timeRanges: [
                    {
                        day: Number,      // from [1, 2, 3, 4, 5, 6, 7]   each number corresponds to a day of the week, starting Monday
                        startAt: String,  // format: HH:MM  24h
                        endAt: String     // format: HH:MM  24h
                    }
                ]
            }

            Drinks.Schema = new mongoose.Schema(schemaDefintion);

            Drinks.Schema.set('toJSON', {
                transform: (document, returnedObj) => {
                    delete returnedObj.__v
                }
            });
        })();

        /** IIFE: Init the Model */
        (function initModel() {
            Drinks.Model = mongoose.model('drinks', Drinks.Schema);
        })(); 
    }

    static isValid = (data) => {
        const { category, title } = data;
        return (category && title);
    }

    static find = () => {
        return Drinks.Model.find({});
    }

    static findOne = (id) => {
        return Drinks.Model.find({_id: id});
    }

    static postOne = (drinkJson) => {
        const drinkDoc = new Drinks.Model(drinkJson);
        return drinkDoc.save();
    }
}

module.exports = { Drinks };