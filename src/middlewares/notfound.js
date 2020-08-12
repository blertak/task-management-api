'use strict'

const httpStatus = require('http-status-codes')
const HttpError = require('../models/HttpError')

const handler = (req, res, next) => {
  return next(new HttpError(httpStatus.getStatusText(httpStatus.NOT_FOUND), httpStatus.NOT_FOUND))
}

module.exports = handler
