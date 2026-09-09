const prisma = require('../prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//post/auth/register

async function register(req, res){
    try{
        const { email , password, fullName} = req.body
        
        if(!email || !password || !fullName ){
            return res.status(400).json({ error: 'email, password, and fullName are required' })
        }

        // check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing){
            return res.status(409).json({ error: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password,10)
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName
            }
        })

        res.status(201).json({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        })
    }catch(error){
        console.error(error)
        res.status(500).json({ error : 'failed to register'})
    }
}



async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // compare the given password with the stored hash
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // create a JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to login' })
  }
}

module.exports = { register, login }