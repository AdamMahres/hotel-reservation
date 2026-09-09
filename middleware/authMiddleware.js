const jwt = require('jsonwebtoken')

// checks the JWT: must be logged in
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]          

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded                            
    next()                                           
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// checks the role: must be admin
function requireAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

module.exports = { authenticate, requireAdmin }