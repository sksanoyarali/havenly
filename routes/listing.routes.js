import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import multer from 'multer'
import { cloudinary, storage } from '../cloudConfig.js'
const upload = multer({ storage })
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
router
  .route('/')
  .get(wrapAsync(showAllListing))
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(registerNewListing)
  )

router.get('/new', isLoggedIn, wrapAsync(renderNewForm))

router
  .route('/:id')
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(updateListing))
  .get(wrapAsync(showListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing))

router.get('/:id/edit', isLoggedIn, wrapAsync(renderUpdateListingForm))
export default router

//
