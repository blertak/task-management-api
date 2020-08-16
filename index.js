'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('./src/config')
const logger = require('./src/helpers/logger')
const db = require('./src/helpers/db')
const { passport } = require('./src/middlewares/auth')
const errorMiddleware = require('./src/middlewares/error')
const notFoundMiddleware = require('./src/middlewares/notfound')
const routes = require('./src/routes')

let server
const app = express()

// server configs
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ strict: true }))
app.use(passport.initialize())

app.use(routes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

// server startup and close
db.connection.once('connected', () => {
  server = app.listen(config.PORT, config.HOST, () => {
    logger.info(`Server is listening on ${config.HOST}:${config.PORT}`)
  })
})

process.on('SIGINT', () => {
  if (server) server.close()
  db.connection.close()
  process.exit(0)
})
