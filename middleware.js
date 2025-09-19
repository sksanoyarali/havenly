import { Listing } from './models/listing.js'
import { Review } from './models/review.js'

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
const isOwner = async (req, res, next) => {
  let { id } = req.params
  let listing = await Listing.findById(id)
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash('error', 'You dont have permission to edit')
    return res.redirect(`/listings/${id}`)
  }
  next()
}
const isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash('error', 'You are not the author of this review')
    return res.redirect(`/listings/${id}`)
  }
  next()
}
export { isLoggedIn, saveRedirectUrl, isOwner, isReviewAuthor }
