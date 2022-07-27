const express = require('express') //enables use of the express js framework. a dependency.
const app = express() // the applicaiton is written in express
const MongoClient = require('mongodb').MongoClient //we will be connecting to server with database using MongoDB as a client module, so needs MongoDB
const PORT = 2121 //will run locally on port 2121--tells express to listen to this port also.
require('dotenv').config() //Broken down into 2 parts: We're first importing env and then loading using .config()
require('dotenv').config()
    //the above are dependences needed

let db, //sets GLOBAL variable of db, giving it a name. 'quality of life' variables lol. available inside other functions for super ease.
    dbConnectionStr = process.env.DB_STRING, //states connection string needed from our MongoDB, but that it is hidden in a .env file, so it accesses the .env
    dbName = 'todo' //states that the dbname is 'todo', is a variable.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to the MongoDB client using the hidden dbConnectionSTring; unified topology is a connection option that Mongo likes? returns a promise that will come back either 'resolved' or 'rejected'. 
    .then(client => { //if the promise returns 'resolved',
        console.log(`Connected to ${dbName} Database`) //console log that things are working the way we want!
        db = client.db(dbName) //setting the variable (assigning) , attaching 'todo' the 'db' variables
    }) // ay Leon, where is your .catch here? seems like the super captain safety way of doing it :)
    .catch(err => console.error(err)

        app.set('view engine', 'ejs') //sets ejs as the rendering engine, and lets express know (the 'view engine')
        app.use(express.static('public')) //serves up the folder called 'public' as is
        app.use(express.urlencoded({ extended: true })) // middleware that intercepts reqs and res's - allows data to be passed to server via request...(https://localhost/route?variable=value&othervariable=othervalue) like when we first learned how to use API's!
        app.use(express.json()) //middleware - telling express to accept data in json, which basically tells it to learn it. load the json body parser for incoming requests.


        app.get('/', async(request, response) => { //a 'get' method, sent to the root of the server. so...when the server 'gets' the request, it will do the below.
            const todoItems = await db.collection('todos').find().toArray()
                //// creating a variable to hold the accessed database collection from Mongo, in this case, the 'todo', and the empty () on .find say, FIND IT ALL! and then put it into an array.
            const itemsLeft = await db.collection('todos')
                .countDocuments({ completed: false })
                //returns a count of the number of records with the 'completed' field set to false
            response.render('index.ejs', { items: todoItems, left: itemsLeft })
        })
        //set shorter, easier variables for the database records we accessed above. then we tell express to render those records, into .ejs for transfer, then we send that rendered, neat data to the client (as HTML)
        // express passes the data from the above two queries into the .ejs file (the template)



        app.post('/addTodo', (request, response) => { //post method for receiving a new 'todo' item. 
            db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //adding the new record to the db, with the completed field marked as 'false'
                .then(result => { //console log (via Heroku)that the 'todo' was added, then refresh the page. //Will set every new item created by the user as false so it will trigger the promise from before // //Handles returned promise, console log into heroku not the browser of the user
                    console.log('Todo Added')
                    response.redirect('/')
                })
                .catch(error => console.error(error))
        })
        //logs an error to the console, if one occurs

        app.put('/markComplete', (request, response) => { //defining an endpoint to handle a PUT req.
            db.collection('todos').updateOne({ thing: request.body.itemFromJS }, //updates a record, using value received from 'itemFromJS' in the body of the request. 

                    {
                        $set: {
                            completed: true // sets the instance as completed
                        }
                    }, {
                        sort: { _id: -1 }, //add it to the bottom of the array
                        upsert: false //update the newest document if multiple exist. if not, create a new record. 
                    })
                .then(result => {
                    console.log('Marked Complete')
                    response.json('Marked Complete')
                }) //if successful, console log! send the info in json.
                .catch(error => console.error(error)) //if there is an error, console log it as such.

        })

        app.put('/markUnComplete', (request, response) => { // does the opposite of the previous request. 
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

        app.delete('/deleteItem', (request, response) => { //handles a delete req at the defined endpoint.
            db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //Mongo function to delete a record from the 'todo'collection.
                .then(result => {
                    console.log('Todo Deleted') //console log if successful
                    response.json('Todo Deleted')
                })
                .catch(error => console.error(error)) //if it fails, it will be logged.

        })

        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server running on port ${PORT}`)
        }) //tells the server to begin listening. activation code.