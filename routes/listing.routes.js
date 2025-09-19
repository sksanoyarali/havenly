import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import { Listing } from '../models/listing.js'
import ExpressError from '../utils/expressError.js'
import { listingSchema } from '../schema.js'
import { isLoggedIn, isOwner } from '../middleware.js'
import {
  deleteListing,
  registerNewListing,
  renderNewForm,
  renderUpdateListingForm,
  showAllListing,
  showListing,
  updateListing,
} from '../controllers/listing.controller.js'
const router = express.Router()
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}

router.get('/', wrapAsync(showAllListing))

router.get('/new', isLoggedIn, wrapAsync(renderNewForm))

router.post('/', isLoggedIn, validateListing, wrapAsync(registerNewListing))
router.put(
  '/:id',
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(updateListing)
)
router.get('/:id', wrapAsync(showListing))
//deleteroute
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(deleteListing))
router.get('/:id/edit', isLoggedIn, wrapAsync(renderUpdateListingForm))
export default router
