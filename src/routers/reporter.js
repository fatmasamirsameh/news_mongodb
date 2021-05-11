const express = require('express')
const router = new express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middleware/auth')
const multer = require('multer')

// router.post('/users',(req,res)=>{
//     // console.log(req.body)

//     const user = new User(req.body)
//     user.save().then(()=>{
//         res.status(200).send(user)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
// })


router.post('/reporters', async (req, res) => {
    const reporter = new Reporter(req.body)

    try {
        await  reporter.save()
        const token = await  reporter.generateToken()
        res.status(201).send({ reporter,token})
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/reporters/login', async (req, res) => {
    try {
        const reporter = await  Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()

        res.send({reporter,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//////////////////////////////////////////////////////////////////////////////////


router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})




//////////////////////////////////////////////////////////////////////////////////
// Get all 

router.get('/reporters',auth,(req,res) => {
    Reporter.find({}).then((reporters) => {
        res.status(200).send(reporters)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
////////////////////////////////////////////////////////////////////////////////////

//Get by id 

// router.get('/reporters/:id',(req,res)=>{
//     const _id = req.params.id
//     reporter.findById(_id).then((reporter)=>{
//         if(!reporter) 
//         {
//             return res.status(404).send('Unable to find reporter')
//         }
//         res.status(200).send(reporter)
//     }).catch((e)=>{
//         res.status(500).send('Connection error')
//     })
// })

///////////////////////////////////////////////////////////////////////////////////////
// Update

router.patch('/reporters/:id', async (req,res)=>{
    const _id = req.params.id
    try{
       const reporter = await Reporter.findByIdAndUpdate(_id,req.body,{
           new:true,
           runValidators:true
       }) 
       if(!reporter){
           return res.status(404).send('reporter is not found')
       }
       res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send('Error has occurred ' + e)

    }
})

/////////////////////////////////////////////////////////////////////////////////

// Update --> bcrypt

router.patch('/reporters/:id',auth, async(req,res)=>{
    const updates = Object.keys(req.body) 
    console.log(updates)

    const allowedUpdates = ['name','password']
    var isValid = updates.every((el)=> allowedUpdates.includes(el))
    console.log(isValid)
    if(!isValid) {
       return res.status(400).send('Can not update')
    }

    const _id = req.params.id
    try{
        const reporter = await Reporter.findById(_id)
        reporter.name = req.body.name
        reporter.password = req.body.password
        reporter.age = req.body.age
        //////////////////////////////////////////////////
        updates.forEach((update)=>(reporter[update] = req.body[update]))
        await reporter.save()

        if(!reporter){
        return res.send('No reporter is found')
        }
      res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send('Error' + e)
    }


})

//Delete

router.delete('/reporters/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const reporter = await Reporter.findByIdAndDelete(_id)
        if(!reporter){
            return res.send('Not found')
        }
        res.send(reporter)
    }
    catch(e){
        res.send(e)
    }
})

////////////////////////////////////////////////////////////////////////////////

router.post('/logout',auth,async(req,res)=>{
    try{
    
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el.token !== req.token
        })

        await req.reporter.save()
        res.send('Logout suceessfully')
    }
    catch(e){
        res.status(500).send('Please login')
    }
})

/////////////////////////////////////////////////////////

router.post('/logoutAll', auth,async(req,res)=>{
    try{
        req.reporter.tokens = []
        await req.reporter.save()
        res.send('Logout all was done suceesfully')
    }
    catch(e){
        res.send('Please Login')
    }
})

////////////////////////////////////////////////////

//delete profile


router.delete('/profile',auth,async(req,res)=>{
    try{
      await req.reporter.remove()
      res.send('Deleted')
    }
    catch(e){
        res.send(e)
    }
})

////////////////////////////////////////////////////////////////////////////////////

// update profile 

router.patch('/profile',auth,async(req,res)=>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','password']

    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('cannot update')
    }

    try{
        updates.forEach((update)=> (req.reporter[update] = req.body[update]))
        await req.reporter.save()
        res.status(200).send(req.reporter)
    }
    catch(e){
        res.status(400).send(e)
    }
})

const uploads = multer({
    limits:{
        fileSize: 1000000 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
           return cb(new Error('Please upload an image'))
        }
       cb(undefined,true)
    }

})

router.post('/profile/image',auth,uploads.single('image'),async(req,res)=>{
    try{
        req.reporter.image = req.file.buffer
        await req.reporter.save()
        res.send()
    }catch(e){
        res.send(e)
    }
})

module.exports = router