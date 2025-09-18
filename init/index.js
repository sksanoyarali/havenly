import mongoose from 'mongoose'
import { data } from './data.js'

import { Listing } from '../models/listing.js'

const MONGO_URL = 'mongodb://127.0.0.1:27017/havenly'

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

const initDb = async () => {
  await Listing.deleteMany()
  const updatedData = data.map((obj) => ({
    ...obj,
    owner: '68cc14dc8f8d7acf863b28f9',
  }))
  await Listing.insertMany(updatedData)
  console.log('data is initialized')
}
initDb()
