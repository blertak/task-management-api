'use strict'

const db = require('../../helpers/db')

const schema = new db.Schema({
  uid: { type: db.Types.ObjectId, required: false },
  taskName: { type: String, required: false },
  date: { type: Number, required: false },
  duration: { type: Number, required: false }
})

const Task = db.model('Task', schema)

module.exports = Task
