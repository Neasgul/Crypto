var sequelize = require('./Sequelize');

module.exports = sequelize.import('User', function(sequelize, DataTypes) {
    return sequelize.define('user',
        {
            id : {
                type : DataTypes.BIGINT,
                primaryKey 		: true,
                autoIncrement 	: true
            },
            email : {
                type 		: DataTypes.STRING,
                allowNull 	: false
            },
            password : {
                type 		: DataTypes.STRING,
                allowNull 	: false
            },
            emailkey : {
                type 		: DataTypes.STRING,
                allowNull 	: true
            }
        },
        {
            paranoid 		: true,
            underscored 	: true,
            freezeTableName : true
        }
    );
});