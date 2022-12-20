const Sequelize = require('sequelize');


const sequelize = new Sequelize('ECOM2BACKEND', 'root', 'Maria123#', {

    dialect: 'mysql',
    host : 'localhost',

});

module.exports = sequelize;