const database = require('../util/database');
const mongodb = require('mongodb');

module.exports = class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; //{ item: [] }
        this._id = id;
    }

    static getUserCollection() {
        return database.getDb().collection('users');
    }

    static getProductCollection() {
        return database.getDb().collection('products');
    }

    async save() {
        try {
            return await User.getUserCollection().insertOne(this);
        } catch(err) {
            console.error(err);
        }
    }

    static async findbyId(userId) {
        try {
            return await User.getUserCollection().findOne({_id: new mongodb.ObjectId(userId)});
        } catch(err) {
            console.error(err);
        }
    }

    async addToCart(product) {
        let updatedCart;
        let newQuantity = 1;
        if (this.cart) {
            const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
            updatedCart = {...this.cart};
            if (cartProductIndex !== -1) {
                newQuantity = this.cart.items[cartProductIndex].quantity + 1;
                updatedCart.items[cartProductIndex].quantity = newQuantity;
            } else {
                updatedCart.items.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })
            }
        } else {
            const updatedCartData = [{ productId: new mongodb.ObjectId(product._id), quantity: newQuantity }]
            updatedCart = {
                items: updatedCartData,
            };
        }
        try {
            return await User.getUserCollection().updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: { cart: updatedCart }}
            );
        } catch(err) {
            console.error(err);
        }
    }

    async getCart() {
        const productIds = this.cart.items.map(product => {
            return product.productId
        });
        try {
            const products = await User.getProductCollection().find({_id: {$in: productIds}}).toArray();
            const productsData = products.map(product => {
                return {
                    ...product,
                    quantity: this.cart.items.find(i => {
                        return i.productId.toString() === product._id.toString();
                    }).quantity,
                }
            });
            return productsData;
        } catch(err) {
            console.error(err);
        }
    }

    async deleteCartItems(prodId) {
        const updatedCart = this.cart.items.filter(item => item.productId.toString() !== prodId.toString());
        try {
            return await User.getUserCollection().updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: { cart: { items: updatedCart } }}
            );
        } catch(err) {
            console.error(err);
        }
    }

    async addOrder() {
        try {
            const products = await this.getCart();
            const order = {
                items: products,
                user: {
                    userId: this._id,
                    name: this.name
                }
            }
            await database.getDb().collection('orders').insertOne(order);
            this.cart.items = [];
            await User.getUserCollection().updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: { cart: { items: [] } }}
            );
        } catch(err) {
            console.error(err);
        }
    }

    async getOrders() {
        try {
            return await database.getDb().collection('orders').find({'user.userId': new mongodb.ObjectId(this._id)}).toArray();
        } catch(err) {
            console.error(err);
        }
    }

};