'use strict'

require('dotenv').config({ path: `${__dirname}/../../${process.env.NODE_ENV === 'test' ? '.test' : ''}.env` })
const env = require('env-var')

const config = {
  PORT: env.get('PORT').default(3000).asPortNumber(),
  HOST: env.get('HOST').default('0.0.0.0').asString(),
  MONGO_CONNECTION_STRING: env.get('MONGO_CONNECTION_STRING').required().asString()
}

module.exports = config
