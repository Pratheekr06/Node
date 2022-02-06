const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/product-list', {prods: products, pageTitle: 'Admin Product', path: '/products', isAuthenticated: req.session.isAuthenticated});
    } catch(err) {
        console.error(err)
    }
};

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        res.render('shop/product-detail', {product: product, pageTitle: 'Product Detail', path: '/products', isAuthenticated: req.session.isAuthenticated});
    } catch(err) {
        console.error(err);
    }
}

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/index', {prods: products, pageTitle: 'Admin Product', path: '/', isAuthenticated: req.session.isAuthenticated});
    } catch(err) {
        console.error(err)
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.product');
        const cart = user.cart;
        res.render('shop/cart', {products: cart, pageTitle: 'Cart', path: '/cart', isAuthenticated: req.session.isAuthenticated});
    } catch(err) {
        console.error(err);
    }
};

exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = await Product.findById(prodId);
        await req.user.addToCart(product)
        res.redirect('/cart')
    } catch(err) {
        console.error(err);
    }
};

exports.postDeleteCartItem = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        await req.user.removeCartItem(prodId);
        res.redirect('/cart');
    } catch(err) {
        console.error(err);
    }
}

exports.postOrders = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.product')
        const productData = user.cart.map(product => {
            return {
                productDetails: {...product.product._doc},
                quantity: product.quantity,
            }
        });
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user._id,
            },
            products: productData
        });
        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch(err) {
        console.error(err);
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id});
        res.render('shop/orders', {orders: orders, pageTitle: 'Orders', path: '/orders', isAuthenticated: req.session.isAuthenticated});
    } catch(err) {
        console.error(err);
    }
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout', isAuthenticated: req.session.isAuthenticated});
};