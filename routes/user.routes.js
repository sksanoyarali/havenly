import express from 'express'
import User from '../models/user.js'
import wrapAsync from '../utils/wrapAsync.js'
import passport from 'passport'
import { saveRedirectUrl } from '../middleware.js'
import {
  loginUser,
  logoutUser,
  renderLoginForm,
  renderSignupForm,
  signupUser,
} from '../controllers/user.controller.js'
const userRouter = express.Router()

userRouter.route('/signup').get(renderSignupForm).post(signupUser)
userRouter
  .route('/login')
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    loginUser
  )
userRouter.get('/logout', logoutUser)
export default userRouter
