const prisma = require('../prisma/client')

async function getAllRooms(req, res){
    try{
        const rooms = await prisma.room.findMany({
            include : {roomType : true},
        })
        res.status(200).json(rooms)
    } catch(error){
        res.status(500).json({error: 'Failed to fetch rooms'})
    }
}


async function getRoomById(req, res) {
    try {
        const {id} = req.params
        const room = await prisma.room.findUnique({
            where : { id : parseInt(id) },
            include: {roomType : true}
        })

        if (!room){
            return res.status(404).json({error:'room not found'})
        }

        res.status(200).json(room)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch room' })
    }
    
}


async function createRoom(req, res) {
    
    try {
        const {roomNumber , roomTypeId} = req.body

        if (!roomNumber || !roomTypeId){
            return res.status(400).json({error : 'roomNumber and roomTypeId are required'})
        }

        const room = await prisma.room.create({
            data : {
                roomNumber,
                roomTypeId : parseInt(roomTypeId)
            }
        })

        res.status(200).json(room)

    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' })
    }
    
}

async function updateRoom(req, res){
    try {
        const {id} = req.params
        const {roomNumber , roomTypeId} = req.body

        const room = await prisma.room.update({
            where: {id: parseInt(id)},
            data: {
                roomNumber,
                roomTypeId: roomTypeId ? parseInt(roomTypeId) : undefined,
            }
        })

        res.status(200).json(room)
    } catch (error) {
        if(error.code === 'P2025'){
            return res.status(404).json({ error: 'Room not found' })
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update room' });
        
    }
}


async function deleteRoom(req, res) {
  try {
    const { id } = req.params;

    await prisma.room.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
}


async function getAvailableRooms(req, res) {
    try {
        const { checkIn , checkOut } = req.query

        if(!checkIn || !checkOut){
            return res.status(400).json({error: "checkIn and checkOut are required !!"})
        }

        const checkInDate = new Date(checkIn)
        const checkOutDate = new Date(checkOut)

        if (checkInDate >= checkOutDate){
            return res.status(400).json({error : 'checkOut must be after checkIn' })
        }

        const availableRooms = await prisma.room.findMany({
            where: {
                reservations: {
                    none: {
                        status: 'CONFIRMED',
                        checkIn : {lt : checkOutDate},
                        checkOut : {gt: checkInDate}
                    }
                }
            },
            include: {roomType: true}
        })

        res.status(200).json(availableRooms)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch available rooms'})
    }
}

module.exports = {getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getAvailableRooms}