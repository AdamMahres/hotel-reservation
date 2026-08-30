const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
    console.log('Seeding database...')

    const single = await prisma.roomType.create({
        data: {name: 'Single', basePrice: 400 , capacity : 1}
    })

    const double =  await prisma.roomType.create({
        data: {name:'Double' , basePrice:800, capacity: 2}
    })

    const suite = await prisma.roomType.create({
        data: {name:'Suite', basePrice:1500, capacity: 4}
    })

    console.log('Created room types.');

    // rooms (each linked to a tyoe via roomTypeId)

    await prisma.room.createMany({
        data: [
            {roomNumber: '101', roomTypeId: single.id},
            {roomNumber: '102', roomTypeId: single.id},
            {roomNumber: '201', roomTypeId: single.id},
            {roomNumber: '202', roomTypeId: double.id},
            {roomNumber: '301', roomTypeId: suite.id},
        ]
    })
    console.log('Created rooms.')

    await prisma.user.create({
        data:{
            email: 'adam@gmail.com',
            password: '123123',
            fullName : 'Samba',
            role:'GUEST'
        }
        
    })

    console.log('Created test user.');
    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error('seeding failed: ', e)
        process.exit(1)

    })
    .finally(async () => {
        await prisma.$disconnect()
    })

