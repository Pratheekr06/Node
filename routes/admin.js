const path = require('path');

const express = require('express');

//const rootDir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');
const auth = require('../middleware/isAuth');
const productValidation = require('../validation/productValidation');

router.get('/add-product', auth.isAdmin, adminController.getAddProduct);

router.post('/add-product', productValidation, auth.isAdmin, adminController.postAddProduct);

router.get('/edit-product/:productId', auth.isAdmin, adminController.getEditProduct);

router.post('/edit-product', productValidation, auth.isAdmin, adminController.postEditProduct);

router.get('/products', auth.isAdmin, adminController.getProducts);

router.post('/delete-product', auth.isAdmin, adminController.postDeleteProduct);

router.get('/requests', auth.isAdmin, adminController.getAdminRequest);

router.post('/requests', auth.isAdmin, adminController.postAdminRequest);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;