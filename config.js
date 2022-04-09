"use strict";

import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.IS_DEV_MODE === "true" ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI;

const defaults = {
    port: process.env.PORT,
    mongoUri,
    baseUri: process.env.API_URI_BASE,
    drinksCollection: "drinks",
    drinksUri: process.env.API_URI_DRINKS,
    foodsUri: process.env.API_URI_FOODS,
    foodsCollection: "foods",
    menusUri: process.env.API_URI_MENUS,
    menusCollection: "restaurantmenus"
};

export default defaults;