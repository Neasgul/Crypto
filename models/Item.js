var sequelize = require('./Sequelize');

module.exports = sequelize.import('Item', function(sequelize, DataTypes) {
    return sequelize.define('item',
        {
            id : {
                type : DataTypes.BIGINT,
                primaryKey 		: true,
                autoIncrement 	: true
            },
            name : {
                type 		: DataTypes.STRING,
                allowNull 	: false,
                unique      : true
            },
            path : {
                type 		: DataTypes.STRING,
                allowNull 	: false,
                unique      : true
            }
        },
        {
            paranoid 		: true,
            underscored 	: true,
            freezeTableName : true
        }
    );
});
