const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) return callback([]);
        else callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(titlee) {
        this.title = titlee;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                console.log(error);
            });
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
}