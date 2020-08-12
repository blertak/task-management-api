'use strict'

const _ = require('lodash')
const TaskModel = require('../models/db/task')
const httpStatus = require('http-status-codes')
const HttpError = require('../models/HttpError')
const db = require('../helpers/db')

class TaskService {
  /**
   * @typedef {Object} Task
   * @property {string} _id
   * @property {string} uid
   * @property {string} taskName
   * @property {number} date
   * @property {number} duration
   */

  /**
   * @param {object} fields
   * @param {string} fields.uid
   * @param {string} fields.taskName
   * @param {number} fields.date
   * @param {number} fields.duration
   * @returns {Promise<Task>}
   */
  async createTask (fields) {
    if (typeof fields !== 'object') throw new HttpError('ERR_INVALID_FIELDS_TYPE', httpStatus.BAD_REQUEST)
    if (typeof fields.taskName !== 'string' || !fields.taskName) throw new HttpError('ERR_TASK_NAME_REQUIRED', httpStatus.BAD_REQUEST)
    if (typeof fields.date !== 'number' || !fields.date) throw new HttpError('ERR_DATE_REQUIRED', httpStatus.BAD_REQUEST)
    if (typeof fields.duration !== 'number' || !fields.duration) throw new HttpError('ERR_DURATION_REQUIRED', httpStatus.BAD_REQUEST)

    const res = await TaskModel.create(_.pick(fields, ['uid', 'taskName', 'date', 'duration']))
    res._id = res._id.toString()
    res.uid = res.uid.toString()

    return res
  }

  /**
   * @param {object} query
   * @returns {Promise<Task[]>}
   */
  async listTasks (query = {}) {
    const res = await TaskModel.find(query)
    res.forEach(x => {
      x._id = x._id.toString()
      x.uid = x.uid.toString()
    })
    return res
  }

  /**
   * @param {string} id
   * @param {object} fields
   * @param {string} fields.taskName
   * @param {number} fields.date
   * @param {number} fields.duration
   * @returns {Promise<Task>}
   */
  async updateTask (id, fields) {
    fields = _.pick(fields, ['taskName', 'date', 'duration'])
    if (typeof fields !== 'object') throw new HttpError('ERR_INVALID_FIELDS_TYPE', httpStatus.BAD_REQUEST)
    if (fields.taskName && typeof fields.taskName !== 'string') throw new HttpError('ERR_TASK_NAME_INVALID', httpStatus.BAD_REQUEST)
    if (fields.date && typeof fields.date !== 'number') throw new HttpError('ERR_DATE_INVALID', httpStatus.BAD_REQUEST)
    if (fields.duration && typeof fields.duration !== 'number') throw new HttpError('ERR_DURATION_INVALID', httpStatus.BAD_REQUEST)

    let res = await TaskModel.findByIdAndUpdate(
      db.Types.ObjectId(id),
      { $set: fields }
    )
    res = _.assign(res, fields)
    res._id = res._id.toString()
    res.uid = res.uid.toString()

    return res
  }

  /**
   * @param {object} query
   * @returns {Promise<boolean>}
   */
  async deleteTask (query) {
    const res = await TaskModel.deleteOne(query)
    return res.deletedCount === 1
  }
}

module.exports = TaskService
