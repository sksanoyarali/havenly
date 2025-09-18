const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //save redirectUrl
    req.session.redirectUrl = req.originalUrl
    req.flash('error', 'you must be logged in to create listing')
    return res.redirect('/login')
  }
  next()
}
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next()
}
export { isLoggedIn, saveRedirectUrl }
