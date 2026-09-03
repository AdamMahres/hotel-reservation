const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations } = require('../controller/reservationController');

router.post('/', createReservation);
router.get('/', getAllReservations);

module.exports = router;