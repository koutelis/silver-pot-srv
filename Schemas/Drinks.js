const mongoose = require('mongoose');

/**
 * Schema and Model operations for Drinks
 */
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
}

module.exports = { Drinks };