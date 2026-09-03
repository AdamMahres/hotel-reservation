const express = require('express')
const app = express()
app.use(express.json())
app.get('/health', (req, res) => {
    res.status(200).json({status:'ok',message: 'Hotel API IS running'})
})

const roomRoutes = require('./routes/roomRoutes')
app.use('/rooms', roomRoutes)

const reservationRoutes = require('./routes/reservationRoutes');
app.use('/reservations', reservationRoutes);


module.exports = app  