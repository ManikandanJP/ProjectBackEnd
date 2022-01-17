require('dotenv-defaults/config')
const mongoose = require('mongoose');
const express = require("express");


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


// middle wares
var cors = require('cors');
const app = express();
const authRoutes = require("./routes/auth")


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
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

// routes
app.use("/api",authRoutes);

app.listen(port, () => {
    console.log(`app is running at ${port}`)
})
