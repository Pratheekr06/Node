const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminReqSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    adminAccessRequest: {
        type: String,
        default: 'off',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('AdminReqs', adminReqSchema);