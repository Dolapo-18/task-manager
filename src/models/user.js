const mongoose = require('mongoose')
//validate unique email
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator')
const bcrypt = require('bcryptjs')
//const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
             if(value.toLowerCase().includes('password')) {
                throw new Error('Value must not contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a +ve number')
            }
        }
    }
})

//
userSchema.statics.findByCredentials = async (email, password) => {
    
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


//by hashing plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this
    //if password is newly created or updated, then hash it
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)

    }
    
    next()
})

//apply the uniqueValidator plugin to userSchema
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)
//User.createIndexes()

module.exports = User