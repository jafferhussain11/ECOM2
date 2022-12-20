const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router(); 

// /admin/add-product => GET
router.get('/addproduct', adminController.getAddProduct);

router.post('/addproduct', adminController.postAddProduct);


module.exports = router;
