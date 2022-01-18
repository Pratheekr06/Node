const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {prods: products, pageTitle: 'Shop', path: '/products'});
        })
        .catch(err => console.error(err))
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {product: product, pageTitle: 'Product Detail', path: '/products'});
        })
        .catch(err => console.error(err));
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {prods: products, pageTitle: 'Shop', path: '/'});
        })
        .catch(err => console.error(err));
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            cart.getProducts()
            .then(products => {
                res.render('shop/cart', {products: products, pageTitle: 'Cart', path: '/cart'});
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err))
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId }});
        })
        .then(products => {
            let product;
            if(products.length > 0) product = products[0];
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            fetchedCart.addProduct(product, { through: { quantity: newQuantity }})
            .then(() => res.redirect('/cart'));
        })
        .catch(err => console.error(err));
};

exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy()
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.error(err));
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity
                        }
                        return product;
                    }))
                })
                .catch(err => console.error(err))
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => res.redirect('/orders'))
        .catch(err =>console.error(err));
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: [{ model: Product }] })
        .then(orders => {
            res.render('shop/orders', {orders: orders, pageTitle: 'Orders', path: '/orders'});
        })
        .catch(err => console.error(err))
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
};