const path = require('path');

const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const auth = require('../middleware/isAuth');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', auth.isAuth, shopController.getCart);

router.post('/cart', auth.isAuth, shopController.postCart);

router.post('/cart-delete-item', auth.isAuth, shopController.postDeleteCartItem);

router.post('/create-order', auth.isAuth, shopController.postOrders);

router.get('/orders', auth.isAuth, shopController.getOrders);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;