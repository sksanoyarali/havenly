import { Review } from '../models/review.js'
import { Listing } from '../models/listing.js'
const createNewReview = async (req, res) => {
  const { id } = req.params
  const listing = await Listing.findById(id)

  let newReview = new Review(req.body.review)
  newReview.author = req.user._id
  listing.reviews.push(newReview)

  await newReview.save()
  await listing.save()

  req.flash('success', 'New Review created')
  res.redirect('/listings/' + id)
}
const deletReview = async (req, res) => {
  let { id, reviewId } = req.params
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash('success', 'review deleted successfully')
  res.redirect(`/listings/${id}`)
}
export { createNewReview, deletReview }
