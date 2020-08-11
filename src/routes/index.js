'use strict'

const router = require('express').Router()
const httpStatus = require('http-status-codes')
const AuthController = require('../controllers/AuthController')
const config = require('../config')

const { passport, authHandler } = require('../middlewares/auth')
const rolesMiddleware = require('../middlewares/roles')
const logger = require('../helpers/logger')

const authController = new AuthController()

router.post('/api/auth/login', authController.login.bind(authController))
router.post('/api/auth/register/admin', authController.registerAdmin.bind(authController))
router.post('/api/auth/register', authController.register.bind(authController))
router.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${config.OAUTH_REDIRECT_URL}?test=false`, session: false }),
  (req, res) => {
    res.redirect(`${config.OAUTH_REDIRECT_URL}/?oauthToken=${req.user.oauthToken}`)
  })
router.get('/api/auth/github', passport.authenticate('github', { scope: ['user'] }))
router.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: `${config.OAUTH_REDIRECT_URL}?test=false`, session: false }),
  (req, res) => {
    res.redirect(`${config.OAUTH_REDIRECT_URL}/?oauthToken=${req.user.oauthToken}`)
  })

router.get('/api/auth/info/admin',
  authHandler,
  rolesMiddleware(['admin']),
  authController.userInfo.bind(authController)
)
router.get('/api/auth/info', authHandler, authController.userInfo.bind(authController))

// router.get('/api/admin/users', authHandler, rolesMiddleware['admin'], ...)

router.get('/info', (req, res) => {
  const serverTime = new Date().toISOString()
  logger.debug(`Server timestamp: ${serverTime}`)

  return res.status(httpStatus.OK).json({ serverTime })
})

module.exports = router
