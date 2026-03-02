const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reserveDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cowork: {
        type: mongoose.Schema.ObjectId,
        ref: 'CoWork',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active','cancelled'],
        default: 'active'
   }

});

module.exports = mongoose.model('Reservation', ReservationSchema);