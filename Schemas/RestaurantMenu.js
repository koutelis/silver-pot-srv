const mongoose = require('mongoose');

/**
 * Schema and Model operations for the restaurant menu template
 */
 class RestaurantMenu {

    static Schema;
    static Model;

    static {

        /** IIFE: Init the Schema */
        (function initSchema() {
            const schemaDefintion = {
                _id: String,
                items: {},
                fontSize: Number
            }

            RestaurantMenu.Schema = new mongoose.Schema(schemaDefintion);

            RestaurantMenu.Schema.set('toJSON', {
                transform: (document, returnedObj) => {
                    delete returnedObj.__v
                }
            });
        })();

        /** IIFE: Init the Model */
        (function initModel() {
            RestaurantMenu.Model = mongoose.model('restaurantmenus', RestaurantMenu.Schema);
        })(); 
    }
}

module.exports = { RestaurantMenu };
