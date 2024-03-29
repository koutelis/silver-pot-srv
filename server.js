"use strict";

import express from "express";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import MongoManager from "./mongodb.js";
import config from "./config.js";

// INIT
const app = express();
const { baseUri, drinksUri, drinksCategorizedUri, foodsUri, menusUri, ordersUri, usersUri, port } = config;
const dbManager = new MongoManager();
dbManager.connect();

// REGISTER A JSON PARSER (MIDDLEWARE)
app.use(express.json());

// CROSS-ORIGIN HANDLER (MIDDLEWARE)
app.use(cors());

// REQUEST LOGGER (MIDDLEWARE)
morgan.token("postBody", req => (req.method === "POST") ? JSON.stringify(req.body) : "");
const requestLogger = morgan(":method :url :status :res[content-length] - :response-time ms :postBody");
app.use(requestLogger);

// HTTP REQUESTS

app.get(baseUri, (request, response, next) => dbManager.baseGet(request, response, next));

app.get(foodsUri, (request, response, next) => dbManager.schemaGetAll(foodsUri, request, response, next));
app.get(foodsUri + ":id", (request, response, next) => dbManager.schemaGetOne(foodsUri, request, response, next));
app.put(foodsUri + ":id", (request, response, next) => dbManager.schemaPutOne(foodsUri, request, response, next));
app.post(foodsUri, (request, response, next) => dbManager.schemaPostOne(foodsUri, request, response, next));
app.delete(foodsUri + ":id", (request, response, next) => dbManager.schemaDeleteOne(foodsUri, request, response, next));

app.get(drinksUri, (request, response, next) => dbManager.schemaGetAll(drinksUri, request, response, next));
app.get(drinksUri + ":id", (request, response, next) => dbManager.schemaGetOne(drinksUri, request, response, next));
app.put(drinksUri + ":id", (request, response, next) => dbManager.schemaPutOne(drinksUri, request, response, next));
app.post(drinksUri, (request, response, next) => dbManager.schemaPostOne(drinksUri, request, response, next));
app.delete(drinksUri + ":id", (request, response, next) => dbManager.schemaDeleteOne(drinksUri, request, response, next));
app.get(drinksCategorizedUri, (request, response, next) => dbManager.drinksGroupedByCategory(request, response, next));

app.get(menusUri + ":id", (request, response, next) => dbManager.schemaGetOne(menusUri, request, response, next));
app.put(menusUri + ":id", (request, response, next) => dbManager.schemaPutOne(menusUri, request, response, next));
app.delete(menusUri, (request, response, next) => dbManager.deletePastMenus(request, response, next));

app.get(ordersUri, (request, response, next) => dbManager.schemaGetAll(ordersUri, request, response, next));
app.get(ordersUri + ":id", (request, response, next) => dbManager.schemaGetOne(ordersUri, request, response, next));
app.get(ordersUri + "table/:id", (request, response, next) => dbManager.orderByTable(request, response, next));
app.post(ordersUri, (request, response, next) => dbManager.schemaPostOne(ordersUri, request, response, next));
app.put(ordersUri + ":id", (request, response, next) => dbManager.schemaPutOne(ordersUri, request, response, next));
app.delete(ordersUri + ":id", (request, response, next) => dbManager.schemaDeleteOne(ordersUri, request, response, next));

app.get(usersUri, (request, response, next) => dbManager.schemaGetAll(usersUri, request, response, next));
app.get(usersUri + ":id", (request, response, next) => dbManager.schemaGetOne(usersUri, request, response, next));
app.put(usersUri + ":id", (request, response, next) => dbManager.schemaPutOne(usersUri, request, response, next));
app.post(usersUri, (request, response, next) => dbManager.schemaPostOne(usersUri, request, response, next));
app.delete(usersUri + ":id", (request, response, next) => dbManager.schemaDeleteOne(usersUri, request, response, next));

/** 
 * UNKNOWN ENDPOINT FOR REQUESTS (MIDDLEWARE HANDLER) 
 */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

/** 
 * REQUEST ERROR HANDLER (MIDDLEWARE) 
 */
const cbAppError = (error, request, response) => {
    console.error(error.message)
    if (error.name === "CastError")
        response.status(400).send({ error: "malformatted id" });
    else if (error.name === "ValidationError")
        response.status(400).send({ error: error.message });
    else response.status(500).end();
};
app.use(cbAppError);

// REST API SERVER-LISTENER
const server = app.listen(port);

// WEBSOCKET ON SAME SERVER
const io = new SocketServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => dbManager.setSocket(socket));
