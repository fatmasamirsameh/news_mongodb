const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const reporterSchema = new mongoose.Schema({
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
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    avatar:{
        type:Buffer
        },
   

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},

{
    timestamps:true
}


)

////////////////////////////////////////////////////////////////////////////////////

// Relation 

reporterSchema.virtual('news',{
    ref:'News',
    localField: '_id',
    foreignField:'owner'


})

//////////////////////////////////////////////////////////////////////////////////////

reporterSchema.statics.findByCredentials = async (email, password) => {
    const reporter = await Reporter.findOne({ email })

    if (!reporter) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, reporter.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return reporter
}

// Hash the plain text password before saving
reporterSchema.pre('save', async function (next) {
    const reporter = this

    if (reporter.isModified('password')) {
        reporter.password = await bcrypt.hash(reporter.password, 8)
    }

    next()
})
//////////////////////////////////////////////////////////////////////////////////
reporterSchema.methods.generateToken = async function(){

    const reporter = this 

    const token = jwt.sign({_id:reporter._id.toString()},'node course')

    reporter.tokens = reporter.tokens.concat({token:token})

    await reporter.save()

    return token
}

//////////////////////////////////////////////////////////////////////////////

// Hide some data
reporterSchema.methods.toJSON = function(){

    const reporter = this

    // document --> object

    const reporterObject = reporter.toObject()

    delete reporterObject.password
    delete reporterObject.tokens

    return reporterObject

}

const Reporter = mongoose.model('Reporter', reporterSchema)


module.exports = Reporter