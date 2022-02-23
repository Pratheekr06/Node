const Product = require('../models/product');
const AdminRequest = require('../models/adminRequest');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const show500 = require('../middleware/500');
const fileHelper = require('../util/fileHelper');

const ITEMS_PER_PAGE = 1;

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: [],
        oldValues: {},
    });
};

exports.postAddProduct = async (req, res, next) => {
    const title = req.body.title;
    const image = req.file.path;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                errorMessage: errors.array()[0].msg,
                oldValues: {
                    title: title,
                    image: image,
                    price: price,
                    description: description,
                }
            })
        }
        const product = new Product({
            title,
            image,
            price,
            description,
        })
        await product.save();
        res.redirect('/');
    } catch(err) {
        console.error(err);
        if (err.errors) {
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                errorMessage: err.errors['price'].message,
                oldValues: {
                    title: title,
                    image: image,
                    price: price,
                    description: description,
                }
            })
        } else {
            show500(err);
            return next(err);
        }
    }
};

exports.getEditProduct = async (req, res, next) => {
    //const isAuthenticated = res.locals.isAuthenticated;
    const editMode = req.query.edit;
    const prodID = req.params.productId;
    try {
        const product = await Product.findById(prodID);
        if(!product) res.redirect('/');
        res.render('admin/edit-product', { product: product, pageTitle: 'Edit Product', path: 'admin/edit-product', editing: editMode, errorMessage: [], oldValues: {}});
    } catch(err) {
        show500(err);
        return next(err);
    }
}

exports.postEditProduct = async (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    // const updatedProduct = {
    //     title: title,
    //     image: image.path,
    //     price: price,
    //     description: description
    // }
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/add-product',
                editing: true,
                errorMessage: errors.array()[0].msg,
                oldValues: {
                    title: title,
                    image: image,
                    price: price,
                    description: description,
                }
            })
        }
    try {
        //await Product.findByIdAndUpdate(req.body.productId, updatedProduct, { new: true });
        const product = await Product.findById(req.body.productId);
        product.title = title;
        product.price = price;
        product.description = description;
        if (product.image) fileHelper.deleteFile(product.image);
        product.image = image.path;
        await product.save();
        res.redirect('/');
    } catch(err) {
        console.error(err);
        if (err.errors) {
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/add-product',
                editing: false,
                errorMessage: err.errors['price'].message,
                oldValues: {
                    title: title,
                    image: image,
                    price: price,
                    description: description,
                }
            })
        } else {
            show500(err);
            return next(err);
        }
    }
}

exports.getProducts = async (req, res, next) => {
    const page = +req.query.page || 1;
    try {
        const totalProducts = await Product.find().countDocuments();
        const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Product',
            path: '/admin/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
        });
    } catch(err) {
        show500(err)
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    const id = req.body.productId;
    try {
        const product = await Product.findById(id);
        if (product.image) fileHelper.deleteFile(product.image);
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Success!' });
    } catch(err) {
        res.status(500).json({ message: 'Deleting product failed.' });
    }
};

exports.getAdminRequest = (req, res, next) => {
    AdminRequest.find({isAdmin: false}).
    then(requests => {
        res.render('admin/requests', {
            requests: requests,
            pageTitle: 'Admin Requests',
            path: '/admin/requests',
            approved: req.flash('approved'),
        })
    })
    .catch(err => {
        next(new Error(err));
    })
};

exports.postAdminRequest = (req, res, next) => {
    const email = req.body.email;
    User.findOne({email})
    .then(user => {
        user.isAdmin = true;
        return user.save();
    })
    .then(user => {
        AdminRequest.findOne({email})
        .then(req => {
            req.isAdmin = true;
            return req.save();
        })
    })
    .then(result => {
        req.flash('approved', 'Admin Access Approved Successfully');
        res.redirect('/admin/requests')
    })
    .catch(err => {
        next(new Error(err));
    });
};