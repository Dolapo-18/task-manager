const mongoose = require('mongoose')
//validate unique email
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')



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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
{
    timestamps: true
})

//lets mongoose determine how User schema is related to Task schema
userSchema.virtual('mytasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})


//Hiding private data by manipulating the user object
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    

    delete userObject.password
    delete userObject.tokens

    return userObject 

}

//generate token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    //the sign method requires a payload that uniquely identifies our user and a secret key
    const token = await jwt.sign({ _id: user._id.toString() }, 'mysecretkey')

    //add the token generated above to the user property "tokens" - an array
    //we concatenate the token generated to the user token object
    user.tokens = user.tokens.concat({ token: token })

    //save to DB
    await user.save()

    return token
}

//the "statics" keyword allows this method be applicable to models
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
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user tasks when user is removed/deleted
userSchema.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

//apply the uniqueValidator plugin to userSchema
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)
//User.createIndexes()

module.exports = User
