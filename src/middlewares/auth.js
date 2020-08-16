'use strict'

const httpStatus = require('http-status-codes')
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const { Strategy: GitHubStrategy } = require('passport-github')
const UserService = require('../services/UserService')
const HttpError = require('../models/HttpError')
const conf = require('../config')

const userService = new UserService()

passport.use(new JwtStrategy({
  secretOrKey: conf.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload, done) => {
  try {
    const { sub: id, iat: expire } = payload

    if (Date.now() - expire > conf.JWT_EXPIRE * 1000) throw new Error('ERR_AUTH_TOKEN_EXPIRED')
    const user = await userService.findById(id)

    return done(null, user)
  } catch (err) {
    return done(err, false)
  }
}))

if (conf.GOOGLE_OAUTH_CLIENT_ID && conf.GOOGLE_OAUTH_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: conf.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: conf.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { id: googleId, emails } = profile
      const email = emails[0].value

      let user
      try {
        user = await userService.findByEmail(email)
      } catch (err) {
        user = { email, googleId, role: 'user' }
      }

      if (user._id) {
        user.googleId = googleId
        // add google id
        await userService.updateUser(user._id, { googleId })
      } else {
        // create new user
        user = await userService.createUser(user)
      }

      await userService.storeOAuthToken(`GOOGLE:${accessToken}`, user._id)
      user.oauthToken = `GOOGLE:${accessToken}` // attach access token to fetch in redirect

      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }))
}

if (conf.GITHUB_OAUTH_CLIENT_ID && conf.GITHUB_OAUTH_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: conf.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: conf.GITHUB_OAUTH_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { id: githubId, emails } = profile
      const email = emails[0].value

      let user
      try {
        user = await userService.findByEmail(email)
      } catch (err) {
        user = { email, githubId, role: 'user' }
      }

      if (user._id) {
        user.githubId = githubId
        // add github id
        await userService.updateUser(user._id, { githubId })
      } else {
        // create new user
        user = await userService.createUser(user)
      }

      await userService.storeOAuthToken(`GITHUB:${accessToken}`, user._id)
      user.oauthToken = `GITHUB:${accessToken}` // attach access token to fetch in redirect

      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }
  ))
}

const oAuthHandler = async (req, res, next) => {
  try {
    const token = req.headers['x-oauth-token']
    if (token) {
      const userId = await userService.getOAuthToken(token)
      if (!userId) throw new HttpError('ERR_AUTH_TOKEN_EXPIRED', httpStatus.FORBIDDEN)

      const user = await userService.findById(userId)
      req.user = user
      return next()
    }

    throw new HttpError('ERR_AUTH_TOKEN_MISSING', httpStatus.FORBIDDEN)
  } catch (err) {
    next(err)
  }
}

const authHandler = (req, res, next) => {
  const jwtToken = req.headers.authorization
  const oAuthToken = req.headers['x-oauth-token']

  if (jwtToken) return passport.authenticate(['jwt'], { session: false })(req, res, next)
  if (oAuthToken) return oAuthHandler(req, res, next)

  return next(new HttpError('ERR_AUTH_TOKEN_MISSING', httpStatus.FORBIDDEN))
}

module.exports = {
  passport,
  oAuthHandler,
  authHandler
}
