const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const Cart = require('./cart');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) return callback([]);
        else callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                    console.log(error);
                });
            } else {
                this.id = Math.floor(Math.random() * 1000).toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (error) => {
                    console.log(error);
                });
            }
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findById(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            callback(product);
        })
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const deletedProduct = products.find(prod => prod.id === id)
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, deletedProduct.price);
                }
            })
        })
    }
}