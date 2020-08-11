'use strict'

const Redis = require('ioredis')
const config = require('../config')

const redis = new Redis(config.REDIS_CONNECTION_STRING)

module.exports = redis
