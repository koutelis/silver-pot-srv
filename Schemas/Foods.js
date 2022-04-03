const mongoose = require('mongoose');

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
                size: {             // when a size is !null, implies the regular (basePrice) changes accordingly
                    small: Number,  // negative number to be added to basePrice and produce a lower amount
                    large: Number   // positive number to be added to basePrice
                },
                addons: [
                    {
                        title: {type: String, required: true}, 
                        price: {type: Number, required: true},  // extra cost (added to basePrice)
                        amount: {type: Number, required: true}
                    }
                ],
                removables: [
                    {
                        title: {type: String, required: true}, 
                        price: {type: Number, required: true},  // discount (subtracted from basePrice)
                        amount: {type: Number, required: true}
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

            Foods.Schema.set('toJSON', {
                transform: (document, returnedObj) => {
                    delete returnedObj.__v
                }
            });
        })();

        /** IIFE: Init the Model */
        (function initModel() {
            Foods.Model = mongoose.model('foods', Foods.Schema);
        })(); 
    }


    static isValid = (data) => {
        const { category, title } = data;
        return (category && title);
    }

    static find = () => {
        return Foods.Model.find({}).sort({category: 'asc', title: 'asc'});
    }

    static findOne = (id) => {
        return Foods.Model.find({_id: id});
    }

    static addOne = (foodJson) => {
        const foodDoc = new Foods.Model(foodJson);
        return foodDoc.save();
    }

    static editOne = (id, foodJson) => {
        return Foods.Model.findByIdAndUpdate(id, foodJson);
    }

    static deleteOne = (id) => {
        return Foods.Model.findByIdAndRemove(id);
    }
}

module.exports = { Foods };