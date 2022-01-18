const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false});
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
    })
    .then(() => {
        console.log('Product Created');
        res.redirect('/');
    })
    .catch(err => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const prodID = req.params.productId;
    Product.findByPk(prodID)
        .then(product => {
            if (!product) res.redirect('/');
            res.render('admin/edit-product', { product: product, pageTitle: 'Edit Product', path: 'admin/edit-product', editing: editMode});
        })
        .catch(err => console.error(err));
}

exports.postEditProduct = (req, res, next) => {
    const id  = req.body.productId ;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findByPk(id)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save();
        })
        .then(() => res.redirect('/'))
        .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {prods: products, pageTitle: 'Admin Product', path: '/admin/products'});
        })
        .catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.destroy({where: {
        id: prodId
    }})
    .then(() => res.redirect('/'))
    .catch(err => console.error(err));
}