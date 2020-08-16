'use strict'

const _ = require('lodash')
const httpStatus = require('http-status-codes')
const UserService = require('../services/UserService')
const HttpError = require('../models/HttpError')
const util = require('../helpers/util')
const config = require('../config')

const PUBLIC_USER_FIELDS = ['email', '_id', 'role']

class UserController {
  constructor () {
    this.service = new UserService()
  }

  async login (req, res, next) {
    try {
      const { email, password } = req.body
      const user = await this.service.findByEmail(email)

      const matches = await util.comparePassword(password, user.password)
      if (!matches) throw new HttpError('ERR_INVALID_CREDENTIALS', httpStatus.FORBIDDEN)

      const jwtToken = util.encryptJwtToken(user._id)
      return res.status(httpStatus.OK).json({
        token: jwtToken,
        expire: config.JWT_EXPIRE,
        userId: user._id
      })
    } catch (err) {
      next(err)
    }
  }

  async register (req, res, next) {
    try {
      const { email, password } = req.body
      const authData = await this._register(email, 'user', password)
      return res.status(httpStatus.OK).json(authData)
    } catch (err) {
      next(err)
    }
  }

  async registerAdmin (req, res, next) {
    try {
      const { email, password } = req.body
      const authData = await this._register(email, 'admin', password)
      return res.status(httpStatus.OK).json(authData)
    } catch (err) {
      next(err)
    }
  }

  async _register (email, role, password) {
    let user
    try {
      user = await this.service.findByEmail(email)
      if (user.password) throw new HttpError('ERR_EMAIL_IN_USE', httpStatus.BAD_REQUEST)
      // user registered via oauth so we allow password registration
      user = await this.service.updateUser(user._id, { password })
    } catch (err) {
      // create since user didn't exist with email
      user = await this.service.createUser({ email, role, password })
    }

    const jwtToken = util.encryptJwtToken(user._id)

    return {
      token: jwtToken,
      expire: config.JWT_EXPIRE,
      userId: user._id
    }
  }

  async updateUserPassword (req, res, next) {
    try {
      await this.service.updateUser(req.user._id, { password: req.body.password })
      return res.status(httpStatus.OK).json()
    } catch (err) {
      next(err)
    }
  }

  async userInfo (req, res, next) {
    try {
      return res.status(httpStatus.OK).json(_.pick(req.user, PUBLIC_USER_FIELDS))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController
