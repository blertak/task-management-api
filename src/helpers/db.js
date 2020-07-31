'use strict'

const mongoose = require('mongoose')
const config = require('../config')

mongoose.connect(config.MONGO_CONNECTION_STRING)

module.exports = mongoose
