import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import ejs from 'ejs'
import ejsMate from 'ejs-mate'
import methodOverride from 'method-override'
import { fileURLToPath } from 'url'
import ExpressError from './utils/expressError.js'
import listingRouter from './routes/listing.routes.js'
import reviewRouter from './routes/review.routes.js'
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
app.use('/listings', listingRouter)
app.use('/listings/:id/reviews', reviewRouter)
//reviews post route

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, 'Page not found'))
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'something going wrong' } = err
  res.render('error.ejs', { message })
})
app.listen(port, () => {
  console.log(`server is running on port:${port}`)
})
