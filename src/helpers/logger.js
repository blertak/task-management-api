'use strict'

const debug = (message) => {
  console.debug(new Date().toISOString(), 'DEBUG', message)
}

const error = (message) => {
  console.error(new Date().toISOString(), 'ERROR', message)
}

const info = (message) => {
  console.info(new Date().toISOString(), 'INFO', message)
}

/**
 * @param {string} type
 * @param {*} message
 */
const log = (type, message) => {
  console.log(new Date().toISOString(), type, message)
}

const warning = (message) => {
  console.warn(new Date().toISOString(), 'WARNING', message)
}

module.exports = {
  debug,
  error,
  info,
  log,
  warning
}
