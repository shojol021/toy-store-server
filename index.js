const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 3000
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {console.log('running on port', port)})