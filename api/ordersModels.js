const mongoose = require("mongoose");

const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');


const orderSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    quantity: {
        type: Number,
        default: 1
    }

});

orderSchema.plugin(uniqueValidator);
orderSchema.plugin(timestamps);

module.exports = mongoose.model('Order', orderSchema);