'use strict'

const _ = require('lodash')
const httpStatus = require('http-status-codes')
const UserService = require('../services/UserService')
const HttpError = require('../models/HttpError')
const db = require('../helpers/db')

class AdminController {
  constructor () {
    this.service = new UserService()
  }

  async listUsers (req, res, next) {
    try {
      const users = await this.service.listUsers()
      return res.status(httpStatus.OK).json(users)
    } catch (err) {
      next(err)
    }
  }

  async findUser (req, res, next) {
    try {
      const { id } = req.params
      const user = await this.service.findById(id)
      if (!user) throw new HttpError('ERR_USER_NOT_FOUND', httpStatus.NOT_FOUND)
      return res.status(httpStatus.OK).json(user)
    } catch (err) {
      next(err)
    }
  }

  async createUser (req, res, next) {
    try {
      const { email, role, password } = req.body
      const emailCount = await this.service.countUsers({ email })

      if (emailCount > 0) throw new HttpError('ERR_EMAIL_IN_USE', httpStatus.BAD_REQUEST)

      const user = await this.service.createUser({ email, role, password })
      return res.status(httpStatus.CREATED).json(user)
    } catch (err) {
      next(err)
    }
  }

  async updateUser (req, res, next) {
    try {
      const { id } = req.params

      const user = await this.service.findById(id)
      if (!user) throw new HttpError('ERR_USER_NOT_FOUND', httpStatus.NOT_FOUND)

      const userUpdated = await this.service.updateUser(id, _.pick(req.body, ['email', 'role']))
      return res.status(httpStatus.OK).json(userUpdated)
    } catch (err) {
      next(err)
    }
  }

  async deleteUser (req, res, next) {
    try {
      const { id } = req.params
      const query = { _id: db.Types.ObjectId(id) }

      const deleted = await this.service.deleteUser(query)
      if (!deleted) throw new HttpError('ERR_USER_NOT_FOUND', httpStatus.NOT_FOUND)

      return res.status(httpStatus.OK).json()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AdminController
