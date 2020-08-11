'use strict'

require('dotenv').config({ path: `${__dirname}/../../${process.env.NODE_ENV === 'test' ? '.test' : ''}.env` })
const env = require('env-var')

const config = {
  PORT: env.get('PORT').default(3000).asPortNumber(),
  HOST: env.get('HOST').default('0.0.0.0').asString(),
  MONGO_CONNECTION_STRING: env.get('MONGO_CONNECTION_STRING').required().asString(),
  REDIS_CONNECTION_STRING: env.get('REDIS_CONNECTION_STRING').required().asString(),
  JWT_EXPIRE: env.get('JWT_EXPIRE').default(3600).asIntPositive(),
  JWT_SECRET: env.get('JWT_SECRET').default('123456').asString(),
  GOOGLE_OAUTH_CLIENT_ID: env.get('GOOGLE_OAUTH_CLIENT_ID').asString(),
  GOOGLE_OAUTH_CLIENT_SECRET: env.get('GOOGLE_OAUTH_CLIENT_SECRET').asString(),
  GITHUB_OAUTH_CLIENT_ID: env.get('GITHUB_OAUTH_CLIENT_ID').asString(),
  GITHUB_OAUTH_CLIENT_SECRET: env.get('GITHUB_OAUTH_CLIENT_SECRET').asString(),
  OAUTH_REDIRECT_URL: env.get('OAUTH_REDIRECT_URL').asString()
}

module.exports = config
