const express = require('express')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const News = require('./models/news')
const Reporter = require('./models/reporter')
const multer = require('multer')

require('./db/mongoose')

const app = express()


app.use(express.json())

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



app.listen(port,()=>{
    console.log('Server is running')
})