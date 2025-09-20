import { Listing } from '../models/listing.js'
const showAllListing = async (req, res) => {
  const allListings = await Listing.find({})
  res.render('listings/index.ejs', { allListings })
}
const renderNewForm = async (req, res) => {
  res.render('listings/new.ejs')
}
const registerNewListing = async (req, res, next) => {
  let url = req.file.path
  let filename = req.file.filename
  const listing = req.body.listing
  const newListing = new Listing(listing)
  newListing.owner = req.user._id
  newListing.image = { url, filename }
  await newListing.save()
  req.flash('success', 'New listing created')
  res.redirect('/listings')
}
const updateListing = async (req, res) => {
  const { id } = req.params
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  req.flash('success', 'Listing updated successfully')
  res.redirect(`/listings/${id}`)
}
const renderUpdateListingForm = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist')
    res.redirect('/listings')
  }
  res.render('listings/edit.ejs', { listing })
}
const deleteListing = async (req, res) => {
  const { id } = req.params
  let deletedListing = await Listing.findByIdAndDelete(id)
  req.flash('success', 'Listing deleted successfully')
  res.redirect('/listings')
}
const showListing = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('owner')
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist')
    return res.redirect('/listings')
  }
  console.log(listing)

  res.render('listings/show.ejs', { listing })
}
export {
  showAllListing,
  renderNewForm,
  registerNewListing,
  updateListing,
  renderUpdateListingForm,
  deleteListing,
  showListing,
}
