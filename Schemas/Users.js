"use strict";

import mongoose  from "mongoose";

/**
 * Schema and Model operations for Drinks
 */
class Users {

    static Schema;
    static Model;
    static collectionName = "users";

    static {
        //////////////////
        // Init the Schema
        const schemaDefintion = {
            _id: {type: String, required: true},  // email address
            name: {type: String, required: true},
            roles: []
        }

        Users.Schema = new mongoose.Schema(schemaDefintion);

        Users.Schema.set("toJSON", {
            transform: (document, returnedObj) => {
                delete returnedObj.__v
            }
        });

        /////////////////
        // Init the Model
        Users.Model = mongoose.model(Users.collectionName, Users.Schema);
    }

    static getAll() {
        return Users.Model
            .find({});
    }

    static getOne(email) {
        return Users.Model.findOne({ _id: email });
    }

    static postOne(data) {
        return (new Users.Model(data)).save();
    }

    static putOne(_id, data) {
        return Users.Model.findByIdAndUpdate(_id, data);
    }

    static deleteOne(_id) {
        return Users.Model.findByIdAndRemove(_id);
    }
}

export default Users;