const express = require('express');
const { getReservations, getReservation, addReservation, updateReservation, deleteReservation,cancelReservation} = require('../controllers/reservations');

const router = express.Router({ mergeParams: true });

const { protect,authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getReservations   )
    .post(protect,authorize('admin','user'),addReservation);

router.route('/:id')
    .get (protect,getReservation)
    .put(protect,authorize('admin','user'),updateReservation)
    .delete(protect,authorize('admin','user'),deleteReservation);
router.put('/:id/cancel',protect,authorize('admin','user'),cancelReservation);
   

module.exports = router;

