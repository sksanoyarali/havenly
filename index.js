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
import session from 'express-session'
import flash from 'connect-flash'
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
const sessionOptions = {
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}
app.get('/', (req, res) => {
  res.send('hi i am route')
})
app.use(session(sessionOptions))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
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
