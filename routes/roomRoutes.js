const express = require('express')
const router = express.Router()
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getAvailableRooms } = require('../controller/roomController')
const { authenticate, requireAdmin } = require('../middleware/authMiddleware')


router.get('/', getAllRooms)
router.get('/available', getAvailableRooms)
router.get('/:id',getRoomById)
router.post('/', authenticate, requireAdmin, createRoom)       // admin only
router.put('/:id', authenticate, requireAdmin, updateRoom)     // admin only
router.delete('/:id', authenticate, requireAdmin, deleteRoom)

module.exports = router