import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import { Listing } from '../models/listing.js'
import ExpressError from '../utils/expressError.js'
import { listingSchema } from '../schema.js'
const router = express.Router()
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render('listings/index.ejs', { allListings })
  })
)

router.get(
  '/new',
  wrapAsync(async (req, res) => {
    res.render('listings/new.ejs')
  })
)

router.post(
  '/',
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listing = req.body.listing
    const newListing = new Listing(listing)
    await newListing.save()
    res.redirect('/listings')
  })
)
router.put(
  '/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params

    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
  })
)
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate('reviews')
    res.render('listings/show.ejs', { listing })
  })
)
//deleteroute
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
  })
)
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render('listings/edit.ejs', { listing })
  })
)
export default router
