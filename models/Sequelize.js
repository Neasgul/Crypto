var Sequelize 	= require('sequelize');
var config 		= require('../utils/config');

module.exports = new Sequelize(config.database.name,  config.database.user, config.database.password, {
    dialect : config.database.dialect,
    storage : config.database.storage

});