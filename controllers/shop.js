const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const AdminRequest = require('../models/adminRequest');
const show500 = require('../middleware/500');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/product-list', {prods: products, pageTitle: 'Admin Product', path: '/products'});
    } catch(err) {
        show500(err);
        return next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        res.render('shop/product-detail', {product: product, pageTitle: 'Product Detail', path: '/products'});
    } catch(err) {
        show500(err);
        return next(err);
    }
}

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/index', {prods: products, pageTitle: 'Admin Product', path: '/'});
    } catch(err) {
        show500(err);
        return next(err);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.product');
        const cart = user.cart;
        res.render('shop/cart', {products: cart, pageTitle: 'Cart', path: '/cart'});
    } catch(err) {
        show500(err);
        return next(err);
    }
};

exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = await Product.findById(prodId);
        await req.user.addToCart(product)
        res.redirect('/cart')
    } catch(err) {
        show500(err);
        return next(err);
    }
};

exports.postDeleteCartItem = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        await req.user.removeCartItem(prodId);
        res.redirect('/cart');
    } catch(err) {
        show500(err);
        return next(err);
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
        show500(err);
        return next(err);
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id});
        res.render('shop/orders', {orders: orders, pageTitle: 'Orders', path: '/orders'});
    } catch(err) {
        show500(err);
        return next(err);
    }
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
};

exports.getRequestAdmin = (req, res, next) => {
    res.render('admin/request-admin', {
        pageTitle: 'Request Admin',
        path: '/request-admin',
        userDetail: {
            name: req.user.name,
            email: req.user.email,
        },
        message: req.flash('message'),
        adminAccessRequest: req.user.adminAccessRequest,
    });
};

exports.postRequestAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.user.email});
        user.adminAccessRequest = 'on';
        await user.save();
        const request = new AdminRequest({
            name: req.user.name,
            email: req.user.email,
            adminAccessRequest: 'on',
            isAdmin: false,
        });
        await request.save();
        res.locals.adminAccessRequest = 'on';
        req.flash('message', 'Request Submitted Successfully')
        res.redirect('/request-admin');
    } catch(err) {
        show500(err);
        return next(err);
    }
};
