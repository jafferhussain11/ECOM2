const Product = require('../models/product');
const path = require('path');
exports.getAddProduct = (req, res, next) => {
  
    //serve the adminshop.html file
    res.sendFile(path.join(__dirname, '../', 'public', 'adminshop.html'));

};

exports.postAddProduct = (req, res, next) => {
   
    console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({ //createProduct magic method provided by sequelize to create a product and adds a foreign key userID to the product table
  
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
  
    }).then((result)=>{
      console.log(result);
      res.redirect('/admin/addproduct');
    }).catch(err=>console.log(err));
  };

