const express = require('express')
const  router = new express.Router()
const News = require('../models/news')
const auth = require('../middleware/auth')


// router.post('/news',async(req,res)=>{
//     const news = new News(req.body)
//     try{
//         await news.save()
//         res.status(200).send(news)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

/////////////////////////////////////////////////////////////////////////////////////

router.post('/news',auth,async(req,res)=>{
  
    const news = new News({...req.body,owner:req.news._id})
    try{
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/news',async(req,res)=>{
    try{
        const news = await News.find({})
        res.send(news)
    }catch(e){
        res.status(500).send(e)
    }
})

///////////////////////////////////////////////////////////////////////////////

// router.get('/news',auth,async(req,res)=>{
//     try{
//         const news = await News.find({owner:req.user._id})
//         res.send(news)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })


// router.get('/tasks/:id',async(req,res)=>{
//     const _id = req.params.id
//     try{
//        // _id
//        // owner : req.user._id
//         const task = await Task.findById(_id)
//         if(!task){
//             return res.status(400).send('No task is found')
//         }
//         res.send(task)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })

/////////////////////////////////////////////////////////////////////////////


router.get('/news/:id',auth,async(req,res)=>{
  
    const _id = req.params.id
    try{
      
        const news = await News.findOne({_id,owner:req.news._id})
        if(!news){
            return res.status(400).send('No news is found')
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})

///////////////////////////////////////////////////////////////////////////
// router.patch('/news/:id',async(req,res)=>{
//     const updates = Object.keys(req.body)
//     try{
//         const news = await News.findById(req.params.id)
//         if(!news){
//             return res.status(404).send()
//         }
//         updates.forEach((update) => news[update]= req.body[update])

//         await news.save()
//         res.send(news)
//     }catch(e){
//         res.send(e)
//     }
// })

////////////////////////////////////////////////////////////////////////////////////

// router.patch('/news/:id',auth,async(req,res)=>{
//     const _id = req.params.id
//     const updates = Object.keys(req.body) 
//     try{
//         const news = await News.findOne({_id,owner:req.news._id})
//         if(!news){
//             return res.status(404).send()
//         }
//         updates.forEach((update) => news[update]= req.body[update])

//         await news.save()
//         res.send(news)
//     }catch(e){
//         res.send(e)
//     }
// })

//////////////////////////////////////////////////////////////////////////////////////

router.delete('/news/:id',async(req,res)=>{
    try{
        const news = await News.findByIdAndDelete(req.params.id)
        if(!news){
            return res.status(400).send()
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send()
    }
})


router.delete('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOneAndDelete({_id,owner:req.news._id})
        if(!news){
            return res.status(400).send()
        }
        res.send('Deleted')
    }
    catch(e){
        res.status(500).send()
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

router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.news.avatar = req.file.buffer
        await req.news.save()
        res.send()
    }catch(e){
        res.send(e)
    }
})
module.exports = router