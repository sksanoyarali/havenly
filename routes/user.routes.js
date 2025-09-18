import express from 'express'
import User from '../models/user.js'
import wrapAsync from '../utils/wrapAsync.js'
import passport from 'passport'
import { saveRedirectUrl } from '../middleware.js'
const userRouter = express.Router()

userRouter.get('/signup', (req, res) => {
  res.render('users/signup.ejs')
})
userRouter.post('/signup', async (req, res, next) => {
  try {
    let { username, email, password } = req.body
    const newUser = new User({ email, username })
    const regiteredUser = await User.register(newUser, password)
    req.login(regiteredUser, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'welcome to hevenly')
      res.redirect('/listings')
    })
  } catch (error) {
    req.flash('error', e.message)
    res.redirect('/signup')
  }
})

userRouter.get('/login', (req, res) => {
  res.render('users/login.ejs')
})
userRouter.post(
  '/login',
  saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash('success', 'Welcome back to havenly')
    const redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl)
  }
)
userRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.flash('success', 'You are logged out')
    res.redirect('/listings')
  })
})
export default userRouter
