import express from 'express'
import mongoose from 'mongoose'
import { Listing } from './models/listing.js'
import path from 'path'
import ejs from 'ejs'
import ejsMate from 'ejs-mate'
import methodOverride from 'method-override'
import { fileURLToPath } from 'url'
import wrapAsync from './utils/wrapAsync.js'
const port = 3000
const app = express()
const MONGO_URL = 'mongodb://127.0.0.1:27017/havenly'
app.use(methodOverride('_method'))
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
async function main() {
  await mongoose.connect(MONGO_URL)
}
main()
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch((err) => {
    console.log('Database connection error', err)
  })
app.get('/', (req, res) => {
  console.log('hi i am route')
})
app.get('/listings', async (req, res) => {
  const allListings = await Listing.find({})
  res.render('listings/index.ejs', { allListings })
})
app.get('/listings/new', async (req, res) => {
  res.render('listings/new.ejs')
})

app.post('/listings', async (req, res, next) => {
  try {
    const listing = req.body.listing
    const newListing = new Listing(listing)
    await newListing.save()
    res.redirect('/listings')
  } catch (error) {
    next(error)
  }
})
app.put('/listings/:id', async (req, res) => {
  const { id } = req.params
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  res.redirect(`/listings/${id}`)
})
app.get('/listings/:id', async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  res.render('listings/show.ejs', { listing })
})
//deleteroute
app.delete('/listings/:id', async (req, res) => {
  const { id } = req.params
  let deletedListing = await Listing.findByIdAndDelete(id)
  res.redirect('/listings')
})
app.get('/listings/:id/edit', async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  res.render('listings/edit.ejs', { listing })
})

app.use((err, req, res, next) => {
  res.send('somthing went wrong')
})
app.listen(port, () => {
  console.log(`server is running on port:${port}`)
})
