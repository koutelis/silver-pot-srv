'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoManager, Foods }  = require('./mongodb');
const { global_variables } = require('./config');

const app = express();
const baseUri = '/api/'
const infoUri = '/info/';
const foodsUri = `${baseUri}foods/`;
const drinksUri = `${baseUri}drinks/`;
const dbManager = new MongoManager();
dbManager.connect();

//#region "MIDDLEWARE pt1"

// REGISTER A JSON PARSER (MIDDLEWARE)
app.use(express.json());  // register a json parser


// CROSS-ORIGIN HANDLER (MIDDLEWARE)
app.use(cors());


// REQUEST LOGGER (MIDDLEWARE)
morgan.token('postBody', function (req) {
    return (req.method === 'POST')
        ? JSON.stringify(req.body)
        : ''
});
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :postBody')
app.use(requestLogger);

//#endregion

//#region "HTTP REQUESTs: MISC ENDPOINTS"

app.get('/', (request, response) => {
    response.send('<h1>SilverPot API</h1>');
});

app.get(infoUri, (request, response, next) => {
    Foods
        .findAll()
        .then(fd => {
            const output =`
            <p>SilverPot contains ${fd.length} menu options</p>
            <p>${new Date().toLocaleString()}</p>
            `;
            response.send(output);
        })
        .catch(err => next(err));
});

//#endregion

//#region "HTTP REQUESTs: FOODS ENDPOINTS"

app.get(foodsUri, (request, response, next) => {
    Foods
        .find()
        .then(fd => response.json(fd))
        .catch(err => next(err))
});

app.get(foodsUri + ':id', (request, response, next) => {
    Foods
        .findOne(request.params.id)
        .then(fd => fd ? response.json(fd) : response.status(404).end())
        .catch(err => next(err));
})

app.post(foodsUri, (request, response, next) => {
    Foods
        .addOne(request.body)
        .then(posted => response.json(posted))
        .catch(err => next(err));
})

app.put(foodsUri + ':id', (request, response, next) => {
    Foods
        .editOne(request.params.id, request.body)
        .then(found => found ? response.json(found) : response.status(404).end())
        .catch(err => next(err));
})

app.delete(foodsUri + ':id', (request, response, next) => {
    Foods.deleteOne(request.params.id)
        .then(found => found ? response.status(204).end() : response.status(404).end())
        .catch(err => next(err));
})

//#endregion

//#region "HTTP REQUESTs: DRINKS ENDPOINTS"

app.get(drinksUri, (request, response, next) => {});

app.get(drinksUri + ':id', (request, response, next) => {})

app.post(drinksUri, (request, response, next) => {})

app.put(drinksUri, (request, response, next) => {})

app.put(drinksUri + ':id', (request, response, next) => {})

app.delete(drinksUri + ':id', (request, response, next) => {})

//#endregion

//#region "MIDDLEWARE pt2"

/** UNKNOWN ENDPOINT FOR REQUESTS (MIDDLEWARE HANDLER) */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);


/** REQUEST ERROR HANDLER (MIDDLEWARE) */
const cbAppError = (error, request, response) => {
    console.error(error.message)
    if (error.name === 'CastError')
        response.status(400).send({ error: 'malformatted id' });
    else if (error.name === 'ValidationError')
        response.status(400).send({ error: error.message });

    response.status(500).end();
    // next(error)
}
app.use(cbAppError)

//#endregion

// REST API SERVER LISTENER
const PORT = global_variables.port || 3001;
const appStartCB = () => console.log(`Silver Pot REST API server running on port ${PORT}`);
app.listen(PORT, appStartCB);
