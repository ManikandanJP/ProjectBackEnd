require('dotenv-defaults/config')
const mongoose = require('mongoose');
const express = require("express");


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


// middle wares
var cors = require('cors');
const app = express();


// My Routes : 
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")



// DB connection
mongoose.connect(process.env.DATABASE,
        { useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex : true}
    ).then( () => {
        console.log("DB CONNECTED")
    }).catch(() => {
        console.log("DB CONNECTION FAILURE")
    })
        
//port
const port = process.env.PORT
// Middle wares : 

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

// routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);


app.listen(port, () => {
    console.log(`app is running at ${port}`)
})
