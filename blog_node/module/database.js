const Sequelize = require('sequelize');
const connectString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + "@localhost/blog";

const dataBase = {
	//empty object for storing stuff
}

dataBase.connect = new Sequelize(connectString);

//CREATE TABLES
dataBase.Users = dataBase.connect.define('user', {
	name: Sequelize.STRING,
	password: Sequelize.STRING,
	email: Sequelize.STRING,


});

dataBase.Messages = dataBase.connect.define('message', {
	title: Sequelize.STRING,
	message: Sequelize.STRING,
});

dataBase.Comments = dataBase.connect.define('comment', {
	comment: Sequelize.STRING,

});

//RELATIONS
dataBase.Users.hasMany(dataBase.Messages);
dataBase.Messages.belongsTo(dataBase.Users);

dataBase.Users.hasMany(dataBase.Comments);
dataBase.Comments.belongsTo(dataBase.Users);

dataBase.Messages.hasMany(dataBase.Comments);
dataBase.Comments.belongsTo(dataBase.Messages);


//EXPORT
module.exports = dataBase;
