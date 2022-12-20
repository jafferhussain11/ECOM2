

const Sequelize = require('sequelize');

const sequelize = require('../util/database');// this is a sequelize instance

const product = sequelize.define('product', { //product is a model definition and not a class it is a sequelize object

  id: { 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = product; 

