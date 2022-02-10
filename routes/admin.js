const path = require('path');

const express = require('express');

//const rootDir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');
const auth = require('../middleware/isAuth');

router.get('/add-product', auth.isAuth, adminController.getAddProduct);

router.post('/add-product', auth.isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', auth.isAuth, adminController.getEditProduct);

router.post('/edit-product', auth.isAuth, adminController.postEditProduct);

router.get('/products', auth.isAuth, adminController.getProducts);

router.post('/delete-product', auth.isAuth, adminController.postDeleteProduct);

module.exports = router;