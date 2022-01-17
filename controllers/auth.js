const { check,validationResult } = require("express-validator");
const User = require("../models/user")
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup =(req,res) =>{
     
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
         return res.status(422).json({
            error : errors.array()[0].msg
        })
    }
    console.log("REQ", req.body);
    const user = new User(req.body);

    user.save((err,user)=> {
        if(err) {
            return res.status(400).json({
                err : "NOT able to save user in DB"
            })
        }
        res.json({
            name : user.name,
            email: user.email,
            id : user._id
        });
    });
    
};

exports.signin =(req,res) =>{
    const {email, password } = req.body;
    console.log("REQ", req.body);
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
         return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    User.findOne({email},(err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error : "User email doen't exists"
            })
        }
     
        if(! user.autheticate(password)) {
           return res.status(401).json({
                error : "Email and Password don't match"
            })
        }
        console.log("MATCHING USER",user )
// put authenicator in cookies
// create  a token
       const token = jwt.sign({_id : user._id}, process.env.SECRET);
// put token in cookie :
         res.cookie("token", token, {expire : new Date() + 9999 });
// send response to front end :

        const {_id, name , email, role} = user;
        return res.json({token, user : {_id, name , email , role}});
        })
};

exports.signout= (req,res) => {
    res.clearCookie("token");
    res.json({
        message : "user Singed out sucessfully"
    })
 };

 //protected routes

exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
});


 // customer Middleware :
 exports.isAuthenticated = (req, res, next ) => {

    let checker = req.profile && req.auth && req.profile._id === req.auth._id;

    if(!checker) {
        return res.send(403).json({
            error : "ACCESS DENINED"
        })
    }
   next();
 }

 exports.isAdmin = (req, res , next) => {

    if(req.profile.role === 0) {
        return res.send(403).json({
            error : "You are not ADMIN, ACCESS DENED"
        })
    }
    next();
 }

 
