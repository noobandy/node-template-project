//Created by anandm at 19-Feb-16

"use strict";
var path = require("path");
var Joi = require("joi");
var Boom = require("boom");

var ToDo = require(path.join(__dirname, "../models/ToDo"));

var routes = [{
    method: "GET",
    path: "/todos",
    config: {
        auth : "jwt",
        handler: function (request, reply) {
            var authenticatedUser = request.auth.credentials;
            ToDo.find({author : authenticatedUser}, function (err, docs) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply(docs);

            });
        },
        description: "Get all ToDo",
        notes: "notes",
        tags: ["ToDo"]
    }
}, {
    method: "GET",
    path: "/todos/{id}",
    config: {
        auth : "jwt",
        validate : {
            params : {
                //mongodb object id
                id : Joi.string().hex().length(24).required()
            }
        },
        handler: function (request, reply) {
            var authenticatedUser = request.auth.credentials;
            var id = request.params.id;

            ToDo.findOne({author : authenticatedUser, _id : id}, function (err, doc) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                if(!doc) {
                    //not found
                    return reply(Boom.notFound("not found"));
                }

                return reply(doc);
            })
        },
        description: "Get ToDo",
        notes: "notes",
        tags: ["ToDo"]
    }
}, {
    method: "POST",
    path: "/todos",
    config: {
        auth : "jwt",
        validate : {
            payload : {
                title : Joi.string().required(),
                description : Joi.string().required(),
                dueDate : Joi.date().min("now")
            }
        },
        handler: function (request, reply) {
            var payload = request.payload;
            var authenticatedUser = request.auth.credentials;
            payload.author = authenticatedUser;

            var resource = new ToDo(payload);

            resource.save(function (err, doc) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply(doc);
            });

        },
        description: "Create a new ToDo",
        notes: "notes",
        tags: ["ToDo"]
    }
}, {
    method: "PUT",
    path: "/todos/{id}",
    config: {
        auth : "jwt",
        validate : {
            params : {
                //mongodb object id
                id : Joi.string().hex().length(24).required()
            },
            payload : {
                title : Joi.string().required(),
                description : Joi.string().required(),
                dueDate : Joi.date().min("now")
            }
        },
        handler: function (request, reply) {
            var id = request.params.id;
            var authenticatedUser = request.auth.credentials;
            var payload = request.payload;
            payload.author = authenticatedUser

            ToDo.update({author : authenticatedUser, _id : id}, {$set : payload}, function (err, result) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply();
            });
        },
        description: "Update ToDo",
        notes: "notes",
        tags: ["ToDo"]
    }
}, {
    method: "POST",
    path: "/todos/{id}/complete",
    config: {
        auth : "jwt",
        validate : {
            params : {
                //mongodb object id
                id : Joi.string().hex().length(24).required()
            }
        },
        handler: function (request, reply) {
            var id = request.params.id;
            var authenticatedUser = request.auth.credentials;

            ToDo.update({author : authenticatedUser, _id : id}, {$set : {completedAt : new Date()}}, function (err, result) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply(result);
            });

        },
        description: "complete a  ToDo",
        notes: "notes",
        tags: ["ToDo"]
    }
}, {
    method: "DELETE",
    path: "/todos/{id}",
    config: {
        auth : "jwt",
        validate : {
            params : {
                //mongodb object id
                id : Joi.string().hex().length(24).required()
            }
        },
        handler: function (request, reply) {
            var id = request.params.id;
            var authenticatedUser = request.auth.credentials;

            ToDo.remove({author : authenticatedUser, _id : id}, function (err, result) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply();
            });
        },
        description: "Delete ToDo",
        notes: "notes",
        tags: ["ToDo"]
    }
}];

module.exports = routes;