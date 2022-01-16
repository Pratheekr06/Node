const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {prods: products, pageTitle: 'Shop', path: '/products'});
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {product: product, pageTitle: 'Product Detail', path: '/products'});
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {prods: products, pageTitle: 'Shop', path: '/'});
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            products.forEach(prod => {
                const cartProductData = cart.products.find(p => p.id === prod.id);
                if (cartProductData) {
                    cartProducts.push({productData: prod, qty: cartProductData.qty});
                }
            });
            res.render('shop/cart', {products: cartProducts, pageTitle: 'Cart', path: '/cart'});
        })
    })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {pageTitle: 'Orders', path: '/orders'});
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
};