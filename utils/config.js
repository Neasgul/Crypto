/*
 * Application Configurations
 */

module.exports = {
	port : 8080,
	database : {
		dialect		: 'sqlite',
		name 		: 'crypto',
		storage		: './database.sqlite',
		user 		: 'root',
		password 	: 'root'
	},
	cookie : 'cryptocookies',
	dir : './cryptedDoc/'
};
