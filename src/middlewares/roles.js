'use strict'

const httpStatus = require('http-status-codes')
const HttpError = require('../models/HttpError')

/**
 * @param {string[]} roles
 */
const handler = (roles) => {
  return (req, res, next) => {
    const err = roles.includes((req.user || {}).role) ? null
      : new HttpError('ERR_ACCESS_DENIED_FOR_ROLE', httpStatus.FORBIDDEN)
    next(err)
  }
}

module.exports = handler
