'use strict'

const TaskService = require('../services/TaskService')
const httpStatus = require('http-status-codes')
const db = require('../helpers/db')
const HttpError = require('../models/HttpError')

class TaskController {
  constructor () {
    this.service = new TaskService()
  }

  _isAdmin (req) {
    return req.user.role === 'admin'
  }

  async createTask (req, res, next) {
    try {
      const { taskName, date, duration } = req.body
      const taskDetails = await this.service.createTask({ uid: req.user._id, taskName, date, duration })
      return res.status(httpStatus.CREATED).json(taskDetails)
    } catch (err) {
      next(err)
    }
  }

  async listTasks (req, res, next) {
    try {
      const { from, to } = req.query
      let query = {}
      if (!this._isAdmin(req)) query.uid = req.user._id

      if (from && to) {
        query = { ...query, $and: [{ date: { $gte: +from } }, { date: { $lte: +to } }] }
      } else if (from) {
        query = { ...query, date: { $gte: +from } }
      } else if (to) {
        query = { ...query, date: { $lte: +to } }
      }

      const tasks = await this.service.listTasks(query)
      return res.status(httpStatus.OK).json(tasks)
    } catch (err) {
      next(err)
    }
  }

  async findTask (req, res, next) {
    try {
      const taskId = req.params.id
      const query = { _id: db.Types.ObjectId(taskId) }
      if (!this._isAdmin(req)) query.uid = req.user._id

      const [task] = await this.service.listTasks(query)
      if (!task) throw new HttpError('ERR_TASK_NOT_FOUND', httpStatus.NOT_FOUND)

      return res.status(httpStatus.OK).json(task)
    } catch (err) {
      next(err)
    }
  }

  async updateTask (req, res, next) {
    try {
      const taskId = req.params.id
      const query = { _id: db.Types.ObjectId(taskId) }
      if (!this._isAdmin(req)) query.uid = req.user._id

      let [task] = await this.service.listTasks(query)
      if (!task) throw new HttpError('ERR_TASK_NOT_FOUND', httpStatus.NOT_FOUND)

      task = await this.service.updateTask(taskId, req.body)
      return res.status(httpStatus.OK).json(task)
    } catch (err) {
      next(err)
    }
  }

  async deleteTask (req, res, next) {
    try {
      const taskId = req.params.id
      const query = { _id: db.Types.ObjectId(taskId) }
      if (!this._isAdmin(req)) query.uid = req.user._id

      const deleted = await this.service.deleteTask(query)
      if (!deleted) throw new HttpError('ERR_TASK_NOT_FOUND', httpStatus.NOT_FOUND)

      return res.status(httpStatus.OK).json()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = TaskController
