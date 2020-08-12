'use strict'

const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')

const config = require('../config')

/**
 * @param {string} userId
 */
const encryptJwtToken = (userId) => jwt.encode({ sub: userId, iat: Date.now() }, config.JWT_SECRET)

/**
 * @param {string} token
 * @returns {{ iat: number, sub: string }}
 */
const decryptJwtToken = (token) => jwt.decode(token, config.JWT_SECRET)

/**
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = (plainPassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, res) => err ? reject(err) : resolve(res))
  })
}

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err)

      bcrypt.hash(password, salt, null, (err, hash) => err ? reject(err) : resolve(hash))
    })
  })
}

/**
 * @param {string} password
 * @returns {string|null}
 */
const checkPasswordPolicy = (password) => {
  let error = null
  if (!(/\d/).test(password)) { error = 'Password must contain a number.' }
  if (!(/\w/).test(password)) { error = 'Password must contain a letter.' }
  if ((/[^a-zA-Z0-9_#!]/ig).test(password)) { error = 'Password must contain only numbers, letters and the followin chars: _#!' }
  if (!password || password.length < 8) { error = 'Password must be 8 characters.' }

  return error
}

const isNil = (value) => value === undefined || value === null

module.exports = {
  isNil,
  encryptJwtToken,
  decryptJwtToken,
  hashPassword,
  comparePassword,
  checkPasswordPolicy
}
