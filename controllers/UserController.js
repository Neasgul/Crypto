var UserModel 	= require('../models').User;
var crypto      = require('crypto');

var UserController = function() {};

UserController.prototype.getAllUsers = function(callback) {

    UserModel.findAll().then(function(users) {
        if (users && users.length != 0)
            callback(undefined, users);
        else
            callback("No User Found");
    }).catch(function(error) {
        callback(error);
    });
};

UserController.prototype.getUserByEmail = function(email, callback) {
    UserModel.find({
        where : {
            email 	: email
        }
    }).then(function(user) {
        if (user)
            callback(undefined,user);
        else
            callback("No user with this email", null);
    }).catch(function(error) {
        callback(error);
    });
};

UserController.prototype.createUser = function (req, callback) {
    var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
    
     UserModel.create({
        email 		: req.body.email,
        password	: hash,
        emailkey    : require("randomstring").generate({
            length: 5,
            charset: 'alphabetic'
        })
    }).then(function(created) {
        callback(undefined, created);
    }).catch(function(error) {
        callback(error);
    });
};

UserController.prototype.deleteUser = function (req, callback) {
    UserModel.destroy({where : {
        id : req.params.id
    }}).then(function (deleted) {
        callback(undefined,"Successfully deleted")
    }).catch(function (error) {
        callback(error)
    })
};

module.exports = new UserController();
