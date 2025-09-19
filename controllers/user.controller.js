import User from '../models/user.js'

const renderSignupForm = (req, res) => {
  res.render('users/signup.ejs')
}
const signupUser = async (req, res, next) => {
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
}
const renderLoginForm = (req, res) => {
  res.render('users/login.ejs')
}
const loginUser = async (req, res) => {
  req.flash('success', 'Welcome back to havenly')
  const redirectUrl = res.locals.redirectUrl || '/listings'
  res.redirect(redirectUrl)
}

const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.flash('success', 'You are logged out')
    res.redirect('/listings')
  })
}
export { signupUser, renderSignupForm, renderLoginForm, loginUser, logoutUser }
