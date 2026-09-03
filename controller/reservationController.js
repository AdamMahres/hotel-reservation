const prisma = require('../prisma/client')



async function createReservation(req, res){
    try {
        const { userId, roomId, checkIn, checkOut } = req.body;
        if (!userId || !roomId || !checkIn || !checkOut) {
            return res.status(400).json({ error: 'userId, roomId, checkIn, and checkOut are required' });
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)


    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'checkOut must be after checkIn' });
    }

    const room = await prisma.room.findUnique({
        where : {id : parseInt(roomId)},
        include : {roomType : true}
    })

    if(!room){
        return res.status(404).json({error : 'Room not found'})
    }
    

    try {
        const reservation = await prisma.$transaction(async (tx) => {
            const conflict = await tx.reservation.findFirst({
                where : {
                    roomId : parseInt(roomId),
                    status: 'CONFIRMED',
                    checkIn: {lt: checkOutDate},
                    checkOut: {gt: checkInDate},
                }
            })

            if(conflict){
                throw new Error('room already booked')
            }

            return await tx.reservation.create({
                data: {
                    userId: parseInt(userId),
                    roomId: parseInt(roomId),
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    priceAtBooking: room.roomType.basePrice,
                }
            })
        })

        return res.status(201).json(reservation)
    } catch (err) {
        if (err.message === 'room already booked'){
            return res.status(409).json({error: 'Room is already booked for these dates'})
        }

        throw err
    }
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create reservation' })
        
    }
}



async function getAllReservations(req, res) {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { 
        user: {select: { id: true, fullName: true, email: true }}, 
        room: true 
    }
    })

    res.status(200).json(reservations)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch reservations' })
  }
}

module.exports = { createReservation, getAllReservations };