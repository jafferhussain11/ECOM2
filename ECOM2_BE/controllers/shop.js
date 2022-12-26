const Product = require('../models/product');
const CartItems = require('../models/cart-item');

const { where } = require('sequelize');
exports.getProducts = (req, res, next) => {

    const page = Number(req.query.page);
    if (page < 1) {
        res.status(404).json({ message: 'Page not found' });
    }
    let totalItems;
    Product.count().then(numProducts => {

        totalItems = numProducts;
        Product.findAll({ offset: (page - 1) * 2, limit: 2 }).then((products) => {
            res.json({
                products: products,
                totalItems: totalItems,
                currentPage: page,
                hasNextPage: 2 * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / 2),

            });
        }).catch(err => res.status(500).json({ message: "Internal DB Error" }));
    }).catch(err => res.status(500).json({ message: "Internal DB Error" }));
};



exports.getCart =  (req, res, next) => {


    const page = Number(req.query.page);
    if (page < 1) {
        res.status(404).json({ message: 'Page not found' });
    }
    let totalItems;
    let quantity;
    CartItems.count().then(numProducts => {

        totalItems = numProducts;
        CartItems.findAll({ offset: (page - 1) * 2, limit: 2 }).then((cartitems) => {


            quantity = cartitems.map(p => p.quantity); //this is an array of quantities which is fetched from the cartitems array using map 
            return Product.findAll({ where: { id: cartitems.map(p => p.productId) } })
            .then((products) => { //select * from products where id IN (1,2) this is the query !!  IMPORTANT


                products = products.map((p, i) => {

                    p.dataValues.quantity = quantity[i];
                    return p;

                });
                res.json({
                    products: products,
                    totalItems: totalItems,
                    currentPage: page,
                    hasNextPage: 2 * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / 2),

                });


            }).catch(err => res.status(500).json({ message: "Internal DB Error" }));


        }).catch(err => res.status(500).json({ message: "Internal DB Error" }));
    }).catch(err => res.status(500).json({ message: "Internal DB Error" }));
   
};



exports.postCart =  (req, res, next) => {

    if (!req.body.id) {

        res.status(404).json({ message: 'No product id found' });
    }
    const prodId = req.body.id;
    //console.log(Object.keys(req.user.__proto__));
    let fetchedCart;
    let newQuantity = 1;
    //req.user is the user object from the session middleware in app.js 
    req.user.getCart().then((cart) => {

        fetchedCart = cart;

        return cart.getProducts({ where: { id: prodId } }) //this checks the caritems table for the product id and returns the product if it exists
            .then((products) => {

                //console.log(products);
                let product;
                if (products.length > 0) {

                    product = products[0];
                }
                if (product) {

                    const oldQuantity = product.cartItem.quantity;
                    newQuantity = oldQuantity + 1;
                    return product;

                }
                return Product.findByPk(prodId); // new product is being added to the cart so we need to fetch the product from the products table
            })
            .then((product) => {
                return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
            })
            .then(() => {
                res.status(200).json({ message: 'Product added to cart' });
            })
            .catch(err => res.status(500).json({ message: "Internal DB Error" }));

    }).catch(err => res.status(500).json({ message: "Internal DB Error" }));

};
exports.postCartDeleteProduct =  (req, res, next) => {

    const prodId = req.params.id;
    console.log(prodId);
    req.user.getCart().then((cart) => {
        return cart.getProducts({ where: { id: prodId } });
    })
        .then((products) => { //products is actually an array of products with only one element
            const product = products[0];
            return product.cartItem.destroy(); // this deletes the product from the cartitems table whic is the join table between cart and products
        })
        .then((result) => {
            res.status(200).json({ message: 'Product deleted from cart' });
        })
        .catch(err => res.status(500).json({ message: "Internal DB Error" }));
};

exports.postOrder =  (req, res, next) => {

    req.user.getCart().then((cart) => {

        return cart.getProducts();
    })
        .then((products) => {

            return req.user.createOrder().then((order) => {

                return order.addProducts(products.map(product => {     //this magic function adds an array of products to the order table

                    product.orderItem = { quantity: product.cartItem.quantity }; //this adds a value to quantity entry of the orderItem table which is the join table between order and products
                    return product;

                }))
            }).then((result) => {

                return req.user.getCart().then((cart) => {
                    return cart.setProducts(null);
                }).then((result) => {
                    res.status(200).json({ message: 'Order placed successfully' });
                })

            })


        }).catch(err => res.status(500).json({ message: "Internal DB Error" }));
};


exports.getOrders =  (req, res, next) => {

    req.user.getOrders({ include: ['products'] }).then((orders) => {

        res.status(200).json({ orders: orders });

    }).catch(err => res.status(500).json({ message: "Internal DB Error" }));
};



//req.user is sequelize object of the user model that has functions like getCart() and getProducts() and addProduct() and so on