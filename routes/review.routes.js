import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import ExpressError from '../utils/expressError.js'
import { reviewSchema } from '../schema.js'
import { isLoggedIn, isReviewAuthor } from '../middleware.js'
import {
  createNewReview,
  deletReview,
} from '../controllers/review.controller.js'
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}
const router = express.Router({ mergeParams: true })
router.post('/', isLoggedIn, validateReview, wrapAsync(createNewReview))
//delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(deletReview))
export default router
