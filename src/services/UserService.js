'use strict'

const _ = require('lodash')
const UserModel = require('../models/db/user')
const HttpError = require('../models/HttpError')
const db = require('../helpers/db')
const redis = require('../helpers/redis')
const util = require('../helpers/util')
const httpStatus = require('http-status-codes')

class UserService {
  /**
   * @typedef {Object} User
   * @property {string} _id
   * @property {string} email
   * @property {string} role
   * @property {string} [password]
   * @property {string} [googleId]
   */

  /**
   * @param {string} email
   * @returns {Promise<User>}
   */
  async findByEmail (email) {
    const user = await UserModel.findOne({ email })
    if (!user) throw new HttpError('ERR_USER_NOT_FOUND', httpStatus.NOT_FOUND)
    user._id = user._id.toString()
    return user
  }

  /**
   * @param {string} id
   * @returns {Promise<User>}
   */
  async findById (id) {
    const _id = db.Types.ObjectId(id)
    const user = await UserModel.findOne({ _id })
    if (!user) throw new HttpError('ERR_USER_NOT_FOUND', httpStatus.NOT_FOUND)
    user._id = user._id.toString()
    return user
  }

  async countUsers (query = {}) {
    const count = await UserModel.countDocuments(query)
    return count
  }

  /**
   * @param {object} query
   * @returns {Promise<User[]>}
   */
  async listUsers (query = {}) {
    const res = await UserModel.find(query)
    res.forEach(x => {
      x._id = x._id.toString()
    })
    return res
  }

  /**
   * @param {object} fields
   * @param {string} fields.email
   * @param {string} fields.role
   * @param {string} [fields.password]
   * @param {string} [fields.googleId]
   * @param {string} [fields.githubId]
   * @returns {Promise<User>}
   */
  async createUser (fields) {
    if (typeof fields !== 'object') throw new HttpError('ERR_INVALID_FIELDS_TYPE', httpStatus.BAD_REQUEST)
    if (!fields.email || typeof fields.email !== 'string') throw new HttpError('ERR_INVALID_FIELDS: email', httpStatus.BAD_REQUEST)
    if (!['admin', 'user'].includes(fields.role)) throw new HttpError('ERR_INVALID_FIELDS: role', httpStatus.BAD_REQUEST)

    if (!util.isNil(fields.password) && (!fields.password || typeof fields.password !== 'string')) {
      throw new HttpError('ERR_INVALID_FIELDS: password', httpStatus.BAD_REQUEST)
    }

    if (!util.isNil(fields.password)) {
      const pwdError = util.checkPasswordPolicy(fields.password)
      if (pwdError) throw new HttpError(`ERR_INVALID_FIELDS: password, ${pwdError}`, httpStatus.BAD_REQUEST)

      fields.password = await util.hashPassword(fields.password)
    }

    if (util.isNil(fields.password) && util.isNil(fields.googleId) && util.isNil(fields.githubId)) {
      throw new HttpError('ERR_INVALID_FIELDS: password or oauth id is required', httpStatus.BAD_REQUEST)
    }

    const res = await UserModel.create(fields)
    res._id = res._id.toString()
    return res
  }

  /**
   * @param {string} id
   * @param {object} fields
   * @param {string} [fields.password]
   * @param {string} [fields.googleId]
   * @returns {Promise<User>}

   */
  async updateUser (id, fields) {
    const _id = db.Types.ObjectId(id)
    fields = _.pick(fields, ['email', 'role', 'password', 'googleId', 'githubId'])

    if (!util.isNil(fields.email) && (!fields.email || typeof fields.email !== 'string')) throw new HttpError('ERR_INVALID_FIELDS: email', httpStatus.BAD_REQUEST)
    if (!util.isNil(fields.role) && !['admin', 'user'].includes(fields.role)) throw new HttpError('ERR_INVALID_FIELDS: role', httpStatus.BAD_REQUEST)

    if (!util.isNil(fields.password) && (!fields.password || typeof fields.password !== 'string')) {
      throw new HttpError('ERR_INVALID_FIELDS: password', httpStatus.BAD_REQUEST)
    }

    if (!util.isNil(fields.password)) {
      const pwdError = util.checkPasswordPolicy(fields.password)
      if (pwdError) throw new HttpError(`ERR_INVALID_FIELDS: password, ${pwdError}`, httpStatus.BAD_REQUEST)

      fields.password = await util.hashPassword(fields.password)
    }

    let user = await UserModel.findByIdAndUpdate(_id, { $set: fields })
    if (!user) throw new HttpError('ERR_USER_NOT_FOUND', httpStatus.NOT_FOUND)
    user = _.assign(user, fields)
    user._id = user._id.toString()
    return user
  }

  /**
   * @param {object} query
   * @returns {Promise<boolean>}
   */
  async deleteUser (query) {
    const res = await UserModel.deleteOne(query)
    return res.deletedCount === 1
  }

  /**
   * @param {string} token
   * @param {string} userId
   * @param {number} expire
   */
  async storeOAuthToken (token, userId, expire = 3600) {
    await redis.set(token, userId, 'ex', expire) // expire in seconds
  }

  /**
   * @param {string} token
   */
  async getOAuthToken (token) {
    const val = await redis.get(token)
    return val
  }
}

module.exports = UserService
