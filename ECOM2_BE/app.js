const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express(); //creating an express app object that has access to all the express methods and properties and can be used to configure the express app and to add middleware and routes to it
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database'); //importing the sequelize object
const Product = require('./models/product'); //importing the product model
const User = require('./models/user'); //importing the user model
const Cart = require('./models/cart'); //importing the cart model
const CartItem = require('./models/cart-item'); //importing the cart-item model
const Order = require('./models/order'); //importing the order model
const OrderItem = require('./models/order-item'); //importing the order-item model
const cors = require('cors');


const errorController = require('./controllers/error'); 



app.use(cors());



const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.json({ extended: false }));// CAREFULL
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => { //middleware that adds a user to the request object

    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); //if user creates a product, the product will be deleted if the user is deleted
User.hasMany(Product); //this is a sequelize method that creates a one to many relationship between user and product and adds a userId column to the product table as a foreign key!
User.hasOne(Cart); //one to one relationship between user and cart with foreign key userId in cart table
Cart.belongsToMany(Product, {through: CartItem}); //many to many relationship between cart and product
Product.belongsToMany(Cart, {through: CartItem}); //many to many relationship between product and cart
Order.belongsTo(User); //one to many relationship between order and user
User.hasMany(Order); //one to many relationship between user and order
Order.belongsToMany(Product, {through: OrderItem}); //many to many relationship between order and product

//remove force: true in production
sequelize.sync()
         .then(result => {

            return User.findByPk(1);
         })
        .then(user => {
            if(!user) {

                return User.create({name: 'Lulu', email:'luluthekingofcats@gmail.com'});
                //add second user 

            }
            return user;
        })
        .then(user => {

            return user.createCart(); //createCart magic method provided by sequelize to create a cart for the current user
            
        })
        .then(app.listen(4000))
        .catch(err=>console.log(err));

