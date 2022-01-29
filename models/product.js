const database = require('../util/database')
const mongodb = require('mongodb');
const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, price, description, userId) {
        this._id = id ? new mongodb.ObjectId(id) : id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.userId = userId;
    }

    static getCollection() {
        return database.getDb().collection('products');
    }

    async save() {
        try {
            if (this._id) {
                return await Product.getCollection().updateOne({_id: this._id}, {$set: this});
            } else {
                return await Product.getCollection().insertOne(this);
            }
        } catch(err) {
            console.error(err);
        }
    }

    static async fetchAll() {
        try {
            return await Product.getCollection().find().toArray();
        } catch (err) {
            console.error(err);
        }
    }

    static async findById(prodId) {
        try {
            return await Product.getCollection().findOne({_id: new mongodb.ObjectId(prodId)});
        } catch(err) {
            console.error(err);
        }
    }

    static async deleteById(prodId) {
        try {
            return await Product.getCollection().deleteOne({_id: new mongodb.ObjectId(prodId)});
        } catch(err) {
            console.error(err);
        }
    }
}