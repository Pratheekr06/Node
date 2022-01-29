const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false});
};

exports.postAddProduct = async (req, res, next) => {
    try {
        const title = req.body.title;
        const imageUrl = req.body.imageUrl;
        const price = req.body.price;
        const description = req.body.description;
        const product = new Product(null,title,imageUrl,price,description, req.user._id);
        await product.save();
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
};

exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;
    const prodID = req.params.productId;
    try {
        const product = await Product.findById(prodID);
        if(!product) res.redirect('/');
        res.render('admin/edit-product', { product: product, pageTitle: 'Edit Product', path: 'admin/edit-product', editing: editMode});
    } catch {
        console.error(err);
    }
}

exports.postEditProduct = async (req, res, next) => {
    const id  = req.body.productId ;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(id,title,imageUrl,price,description);
    try {
        await product.save();
        res.redirect('/')
    } catch(err) {
        console.error(err);
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('admin/products', {prods: products, pageTitle: 'Admin Product', path: '/admin/products'});
    } catch(err) {
        console.error(err)
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    const id = req.body.productId;
    try {
        await Product.deleteById(id);
        res.redirect('/');
    } catch {
        console.error(err);
    }
};