const mongoose = require('mongoose')


const newsSchema = new mongoose.Schema(
    {
    description:{
        type:String,
        trim:true,
        required: true,
    },
    title:{
        type:String,
        trim:true,
        unique: true,
        required: true,
       
    },
    
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporter' 

    }
},
{
    timestamps:true
}

 )



const News = mongoose.model('News',newsSchema)

module.exports =  News