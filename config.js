"use strict";

import dotenv from "dotenv";
dotenv.config();

const config = {
    baseUri: process.env.API_URI_BASE,
    drinksUri: process.env.API_URI_DRINKS,
    foodsUri: process.env.API_URI_FOODS,
    menusUri: process.env.API_URI_MENUS,
    ordersUri: process.env.API_URI_ORDERS,
    mongoUri: process.env.IS_DEV_MODE === "true" ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI,
    port: process.env.PORT
};

export default config;