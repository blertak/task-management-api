'use strict'

const httpStatus = require('http-status-codes')

const handler = (req, res, next) => {
  const err = new Error(httpStatus.getStatusText(httpStatus.NOT_FOUND))
  err.statusCode = httpStatus.NOT_FOUND

  return next(err)
}

module.exports = handler
