// Require
const mongodb = require('mongodb')



const mongoClient = mongodb.MongoClient

//Define connection Url

const connectionUrl = 'mongodb://127.0.0.1:27017'

// Name to our database

const dbName = 'news-manager'

mongoClient.connect(connectionUrl,{useNewUrlParser:true ,useUnifiedTopology: true},(error,client)=>{
    if(error){
       return console.log('Error has occurred')
    }
    console.log('Success')
    const db = client.db(dbName)

    
const ObjectID = mongodb.ObjectID


db.collection('reporters').deleteMany({}).then((result)=>{
    console.log(result.deletedCount)
}).catch((error)=>{
    console.log(error)
})

})






