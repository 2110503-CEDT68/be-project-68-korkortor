const express = require('express');
const { getCoworks, getCowork, createCowork, updateCowork, deleteCowork } = require('../controllers/coworks');

//include other resourse router
const reservationRouter = require('./reservations');
const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:coworkId/reservations/',reservationRouter);

router.route('/').get(getCoworks).post(protect,authorize('admin'),createCowork);
router.route('/:id').get(getCowork).put(protect,authorize('admin'),updateCowork).delete(protect,authorize('admin'),deleteCowork);

module.exports=router;