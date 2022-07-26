const express = require('express') //enables use of the express js framework. a dependency.
const app = express() // the applicaiton is written in express
const MongoClient = require('mongodb').MongoClient //we will be connecting to server with database using MongoDB as a client module, so needs MongoDB
const PORT = 2121 //will run locally on port 2121--tells express to listen to this port also.
require('dotenv').config() //Broken down into 2 parts: We're first importing env and then loading using .config()
require('dotenv').config()
    //the above are dependences needed

let db, //sets variable of db, giving it a name. 'quality of life' variables lol
    dbConnectionStr = process.env.DB_STRING, //states connection string needed from our MongoDB, but that it is hidden in a .env file, so it accesses the .env
    dbName = 'todo' //states that the dbname is 'todo', is a variable.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to the MongoDB client using the hidden dbConnectionSTring; unified topology is a connection option that Mongo likes? returns a promise that will come back either 'resolved' or 'rejected'. 
    .then(client => { //if the promise returns 'resolved',
        console.log(`Connected to ${dbName} Database`) //console log that things are working the way we want!
        db = client.db(dbName) //setting the variable (assigning) , attaching 'todo' the 'db' variables
    }) // ay Leon, where is your .catch here? seems like the super captain safety way of doing it :)
    .catch(err => console.error(err)

        app.set('view engine', 'ejs') //sets ejs as the rendering engine, and lets express know (the 'view engine')
        app.use(express.static('public')) app.use(express.urlencoded({ extended: true })) app.use(express.json())


        app.get('/', async(request, response) => {
            const todoItems = await db.collection('todos').find().toArray()
            const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
            response.render('index.ejs', { items: todoItems, left: itemsLeft })
        })

        app.post('/addTodo', (request, response) => {
            db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
                .then(result => {
                    console.log('Todo Added')
                    response.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/markComplete', (request, response) => {
            db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
                    $set: {
                        completed: true
                    }
                }, {
                    sort: { _id: -1 },
                    upsert: false
                })
                .then(result => {
                    console.log('Marked Complete')
                    response.json('Marked Complete')
                })
                .catch(error => console.error(error))

        })

        app.put('/markUnComplete', (request, response) => {
            db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
                    $set: {
                        completed: false
                    }
                }, {
                    sort: { _id: -1 },
                    upsert: false
                })
                .then(result => {
                    console.log('Marked Complete')
                    response.json('Marked Complete')
                })
                .catch(error => console.error(error))

        })

        app.delete('/deleteItem', (request, response) => {
            db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
                .then(result => {
                    console.log('Todo Deleted')
                    response.json('Todo Deleted')
                })
                .catch(error => console.error(error))

        })

        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })