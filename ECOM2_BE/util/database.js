const Sequelize = require('sequelize');


const sequelize = new Sequelize(password and id of db goes here, {

    dialect: 'mysql',
    host : 'localhost',

});

module.exports = sequelize;
