"use strict";

import dotenv from "dotenv";
dotenv.config();

const config = {
    baseUri: process.env.API_URI_BASE,
    drinksUri: process.env.API_URI_DRINKS,
    drinksCategorizedUri: process.env.API_URI_DRINKS_CAT,
    foodsUri: process.env.API_URI_FOODS,
    menusUri: process.env.API_URI_MENUS,
    ordersUri: process.env.API_URI_ORDERS,
    usersUri: process.env.API_URI_USERS,
    mongoUri: process.env.IS_DEV_MODE === "true" ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI,
    port: process.env.PORT
};

export default config;