const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    permissions: {
      type: [],
      required: true,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', function(next) {
  const user = this

  if (!user.isModified('password')) return next()
  const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALTFACTOR))
  const hash = bcrypt.hashSync(user.password, salt)
  user.password = hash
  next()
})

// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//   return bcrypt.compareSync(candidatePassword, this.password)
// }
UserSchema.methods.validPassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
