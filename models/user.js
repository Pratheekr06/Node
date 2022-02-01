const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }]
});

userSchema.methods.addToCart = function(product) {
    let updatedCart;
    let newQuantity = 1;
    if (this.cart) {
        const cartProductIndex = this.cart.findIndex(cp => cp.product.toString() === product._id.toString());
        updatedCart = [...this.cart];
        if (cartProductIndex !== -1) {
            newQuantity = this.cart[cartProductIndex].quantity + 1;
            updatedCart[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCart.push({ product: product._id, quantity: newQuantity })
        }
    } else {
        const updatedCartData = [{ product: product._id, quantity: newQuantity }]
        updatedCart = updatedCartData;
    }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeCartItem = function(prodId) {
    const updatedCart = this.cart.filter(item => item.product.toString() !== prodId.toString());
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = [];
    this.save();
}

module.exports = mongoose.model('User', userSchema);