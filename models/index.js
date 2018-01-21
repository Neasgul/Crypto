var Sequelize 	= require('./Sequelize');
var User 		= require('./User');
var Item        = require('./Item');

User.hasMany(Item,{as: 'item'});

Sequelize.sync();

module.exports = {
    sequelize 	: Sequelize,
    User		: User,
    Item        : Item
};