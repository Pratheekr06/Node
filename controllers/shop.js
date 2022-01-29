const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/product-list', {prods: products, pageTitle: 'Admin Product', path: '/products'});
    } catch(err) {
        console.error(err)
    }
};

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        res.render('shop/product-detail', {product: product, pageTitle: 'Product Detail', path: '/products'});
    } catch(err) {
        console.error(err);
    }
}

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/index', {prods: products, pageTitle: 'Admin Product', path: '/'});
    } catch(err) {
        console.error(err)
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cartProducts = await req.user.getCart();
        res.render('shop/cart', {products: cartProducts, pageTitle: 'Cart', path: '/cart'});
    } catch(err) {
        console.error(err);
    }
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         products.forEach(prod => {
    //             const cartProductData = cart.products.find(p => p.id === prod.id);
    //             if (cartProductData) {
    //                 cartProducts.push({productData: prod, qty: cartProductData.qty});
    //             }
    //         });
    //         res.render('shop/cart', {products: cartProducts, pageTitle: 'Cart', path: '/cart'});
    //     })
    // })
};

exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = await Product.findById(prodId);
        const response = await req.user.addToCart(product)
        res.redirect('/cart')
    } catch(err) {
        console.error(err);
    }
};

exports.postDeleteCartItem = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        await req.user.deleteCartItems(prodId);
        res.redirect('/cart');
    } catch(err) {
        console.error(err);
    }
}

exports.postOrders = async (req, res, next) => {
    try {
        await req.user.addOrder();
        res.redirect('/orders');
    } catch(err) {
        console.error(err);
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders();
        res.render('shop/orders', {orders: orders, pageTitle: 'Orders', path: '/orders'});
    } catch(err) {
        console.error(err);
    }
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
};