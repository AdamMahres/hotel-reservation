const express = require('express')
const app = express()
app.use(express.json())
app.get('/health', (req, res) => {
    res.status(200).json({status:'ok',message: 'Hotel API IS running'})
})

module.exports = app