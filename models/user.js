import { required } from 'joi'
import mongoose, { Schema } from 'mongoose'

import passportLocalMongoosse from 'passport-local-mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
})
User.plugin(passportLocalMongoosse)
const User = mongoose.model('User', userSchema)
export default User
