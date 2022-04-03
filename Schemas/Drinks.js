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
                basePrice: {type: Number},
                sizes: {             
                    small: Number,
                    regular: Number, // if !null, the regular (basePrice) is overriden to match this value
                    large: Number
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
        return Drinks.Model.find({}).sort({category: 'asc', title: 'asc'});
    }

    static findOne = (id) => {
        return Drinks.Model.find({_id: id});
    }

    static addOne = (drinkJson) => {
        const drinkDoc = new Drinks.Model(drinkJson);
        return drinkDoc.save();
    }

    static editOne = (id, drinkJson) => {
        return Drinks.Model.findByIdAndUpdate(id, drinkJson);
    }

    static deleteOne = (id) => {
        return Drinks.Model.findByIdAndRemove(id);
    }
}

module.exports = { Drinks };