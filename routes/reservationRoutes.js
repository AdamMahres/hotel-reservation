const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations } = require('../controller/reservationController');
const { authenticate } = require('../middleware/authMiddleware')


router.post('/', authenticate, createReservation)     // ← must be logged in
router.get('/', authenticate, getAllReservations)

module.exports = router;