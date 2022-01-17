// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../util/path');
const Cart = require('./cart');
const db = require('../util/database');

//const p = path.join(rootDir, 'data', 'products.json');


module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        return db.execute('INSERT into products(title, price, description, imageUrl) VALUES(?, ?, ?, ?)', [this.title, this.price, this.description, this.imageUrl])
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute(`SELECT * FROM products WHERE (id = ${id})`);
    }

    static deleteById(id) {
        
    }
}