import mongoose, { Schema } from 'mongoose'
import { Review } from './review.js'
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, //now we are just taking url
    default:
      'https://unsplash.com/photos/a-red-tree-in-the-middle-of-a-field-zfgO6e-8NYE',
    set: (v) =>
      v === ''
        ? 'https://unsplash.com/photos/a-red-tree-in-the-middle-of-a-field-zfgO6e-8NYE'
        : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})
listingSchema.post('findOneAndDelete', async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
})
const Listing = mongoose.model('Listing', listingSchema)

export { Listing }
