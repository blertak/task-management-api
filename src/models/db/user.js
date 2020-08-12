'use strict'

const db = require('../../helpers/db')

const schema = new db.Schema({
  email: { type: String, required: true, unique: true, validate: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
  role: { type: String, required: true, validate: /^(admin|user)$/ },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  githubId: { type: String, required: false }
})

const User = db.model('User', schema)

module.exports = User
