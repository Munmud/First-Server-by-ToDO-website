let express = require("express")
let mongodb = require("mongodb")
let sanitizeHTML = require('sanitize-html')

// const { nextTick } = require("process")

let app = express()
let db
let port = process.env.PORT
if (port == null || port =="") port = 3000

app.use(express.static('public'))

let connectionString = 'mongodb+srv://toDoAppUser:myPass@cluster0.32yrq.mongodb.net/Moontasir_First_Try?retryWrites=true&w=majority'
mongodb.connect( connectionString , { useNewUrlParser : true } , ( err , client ) => {
    db = client.db()
    app.listen(port)
} )

app.use(express.json())
app.use(express.urlencoded({extended:false}))

function passwordProtected ( req , res , next ) {
    res.set('WWW-authenticate' , 'Basic realm="Simple Todo App"')
    if (req.headers.authorization == "Basic TW9vbjoxMjM=")  {
        next()
    }
    else {
        res.status(401).send("Authentication required")
    }
}
app.use(passwordProtected)

app.get('/'  , (req , res) => {
    db.collection('Items').find().toArray((err , items) => {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple To-Do App</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
            </head>
            <body>
            <div class="container">
                <h1 class="display-4 text-center py-1">To-Do App!</h1>
                
                <div class="jumbotron p-3 shadow-sm">
                    <form id = "create-form" action="/create-item" method="POST">
                        <div class="d-flex align-items-center">
                            <input id="create-field" autofocus autocomplete="off"
                            name = "item" class="form-control mr-3" type="text" style="flex: 1;">
                            <button class="btn btn-primary">Add New Item</button>
                        </div>
                    </form>
                </div>
                
                <ul id = "item-list" class="list-group pb-5">
                    
                </ul>
                
            </div>
            
            <script>
            let items = ${JSON.stringify(items)}
            </script>

            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script src="/browser.js"></script>
            </body>
            </html>
        `)
    })
    
})

app.post('/create-item' , (req , res) => {
    let safeText = sanitizeHTML(req.body.text,{
        allowedTags: [] , 
        allowedAttributes : {}
    })
    db.collection('Items').insertOne( {text : safeText} , ( err , info) => {
         res.json(info.ops[0])
    } )
   
} )

app.post('/update-item' , (req , res) => {
    // console.log(req.body.text)
    // res.send("Success") 
    let safeText = sanitizeHTML(req.body.text,{
        allowedTags: [] , 
        allowedAttributes : {}
    })
    db.collection('Items').findOneAndUpdate({_id:new mongodb.ObjectID(req.body.id)} , {$set:{text : safeText}} , () => {
        res.send("Success")
    })
})

app.post('/delete-item' , (req , res) => {
    db.collection('Items').deleteOne({_id:new mongodb.ObjectID(req.body.id)},() => {
        res.send("Success") 
    })
})

