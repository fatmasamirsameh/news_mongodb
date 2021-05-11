const express = require('express')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const News = require('./models/news')
const Reporter = require('./models/reporter')
const multer = require('multer')
const cors= require('cors')

require('./db/mongoose')

const app = express()


app.use(express.json())
app.use(cors())

app.use(reporterRouter)
app.use(newsRouter)


const port = 3000

////////////////////////////////////////////////////////////////////

// const uploads = multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000              
//     }
    
// })

// app.post('/uploads', uploads.single('image'),(req,res)=>{
//     res.send()
// })

const main = async () =>{
    // const reporter = await Reporter.findById('607fd768b49b120e94c10603')
    // await reporter.populate('owner').execPopulate()
    // console.log(reporter.owner)

    const reporter = await Reporter.findById('607fd768b49b120e94c10603')
    await  reporter .populate('news').execPopulate()
    console.log( reporter.news)
}

// main()

app.listen(port,()=>{
    console.log('Server is running')
})