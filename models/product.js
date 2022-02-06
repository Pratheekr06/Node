const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    },
);

// productSchema.path('title').get(function(v) {
//     return v + 'is title';
// });
// productSchema.set('toObject', { getters: true })
// productSchema.virtual('tp').get(function() {
//     return this.title + this.price;
// })

// productSchema.post('save', function(doc) {
//     console.log(doc);
// })

module.exports = mongoose.model('Product', productSchema);