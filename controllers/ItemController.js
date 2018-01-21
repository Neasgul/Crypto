var ItemModel   = require('../models').Item;
var UserController = require('./UserController');

var ItemController = function () {};

ItemController.prototype.getAllItem = function (callback) {
    ItemModel.findAll().then(function (item) {
        if (item && item.length != 0)
            callback(undefined, item);
        else
            callback("No Item Found");
    }).catch(function(error) {
        callback(error);
    });
};

ItemController.prototype.getAllItemForUser = function (user, callback) {
    ItemModel.findAll({
        where: {
            user_id : user.id
        }
    }).then(function (item) {
        if (item){
            callback(undefined, item)
        }else {
            callback('no Item')
        }
    }).catch(function(error) {
        callback(error);
    });
};

ItemController.prototype.getItemByName = function (req, callback) {
    var Itemname;

    if(req.body.name)
        Itemname = req.body.name;
    if(req.params.name)
        Itemname = req.params.name;
    ItemModel.find({
        where: {
            name : Itemname
        }
    }).then(function (item) {
        if (item){
            callback(undefined, item)
        }else {
            callback('Item not found')
        }
    }).catch(function(error) {
        callback(error);
    });
};

ItemController.prototype.getItemById = function (req, callback) {
    ItemModel.find({
        where: {
            id : req.body.id
        }
    }).then(function (item) {
        if (item){
            callback(undefined, item)
        }else {
            callback('Item not found')
        }
    }).catch(function(error) {
        callback(error);
    });
};


ItemController.prototype.createItem = function (file, user, callback) {
    if(user){
        ItemModel.create({
            name: file.name,
            path: file.path,
            user_id: user.id
        }).then(function (created) {
            callback(undefined, "Successfully created");
        }).catch(function (error) {
            callback(error);
        });
    }

};

ItemController.prototype.updateItem = function (req, callback) {
    var attributes = {};

    if(req.body.name){
        attributes.name = req.body.name;
    }
    if(req.body.user_id){
        attributes.user_id = req.body.user_id;
    }
    if(req.body.type_id){
        attributes.type_id = req.body.type_id;
    }

    ItemModel.update(attributes,{where : {
            id : req.body.id
        }}
    ).then(function (updated) {
        callback(undefined,"Successfully updated")
    }).catch(function (error) {
        callback(error)
    })
};

ItemController.prototype.deleteItem = function (req, callback) {
    ItemModel.destroy({where : {
        id : req.params.id
    }}).then(function (deleted) {
        callback(undefined,"Successfully deleted")
    }).catch(function (error) {
        callback(error)
    })
};

module.exports = new ItemController();