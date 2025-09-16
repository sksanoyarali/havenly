import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import { Review } from '../models/review.js'
import { Listing } from '../models/listing.js'
import ExpressError from '../utils/expressError.js'
import { reviewSchema } from '../schema.js'
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}
const router = express.Router({ mergeParams: true })
router.post(
  '/',
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params
    const listing = await Listing.findById(id)
    // if(listing){
    //   throw ExpressError(404,"I")
    // }
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    res.redirect('/listings/' + id)
  })
)
//delete review route
router.delete(
  '/:reviewId',
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
  })
)
export default router
