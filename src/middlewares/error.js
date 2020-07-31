'use strict'

const httpStatus = require('http-status-codes')

const handler = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR
  const message = err.message || httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)

  return res.status(statusCode).json({ message })
}

module.exports = handler
