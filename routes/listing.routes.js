import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import { Listing } from '../models/listing.js'
import ExpressError from '../utils/expressError.js'
import { listingSchema } from '../schema.js'
import { isLoggedIn, isOwner } from '../middleware.js'
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
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render('listings/new.ejs')
  })
)

router.post(
  '/',
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listing = req.body.listing
    const newListing = new Listing(listing)
    newListing.owner = req.user._id
    await newListing.save()
    req.flash('success', 'New listing created')
    res.redirect('/listings')
  })
)
router.put(
  '/:id',
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash('success', 'Listing updated successfully')
    res.redirect(`/listings/${id}`)
  })
)
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
      .populate('reviews')
      .populate('owner')
    if (!listing) {
      req.flash('error', 'Listing you requested for does not exist')
      return res.redirect('/listings')
    }
    console.log(listing)

    res.render('listings/show.ejs', { listing })
  })
)
//deleteroute
router.delete(
  '/:id',
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    req.flash('success', 'Listing deleted successfully')
    res.redirect('/listings')
  })
)
router.get(
  '/:id/edit',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
      req.flash('error', 'Listing you requested for does not exist')
      res.redirect('/listings')
    }
    res.render('listings/edit.ejs', { listing })
  })
)
export default router
