const express = require('express')
const cors = require('cors')

// Create server
const server = express()
server.use(cors())

require('./routes').setRoutes(server);

server.listen(30010, () => console.log('Server is listening on http://localhost:30010'))