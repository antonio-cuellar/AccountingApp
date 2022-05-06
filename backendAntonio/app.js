//jshint esversion:6
/// Necessary modules
require('dotenv').config(); //// For environment variables 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

app.set('view engine', 'ejs');/// Set the engine to render the ejs
app.use(bodyParser.urlencoded({extended: true}));/// Url encoded to retrive html names and values
app.use(express.static("public")); /// Server dir

/// Mongoose connection configuration
const url = "mongodb://localhost:27017/userDbAccountin"; /// LocalHost Route to userDB
mongoose.connect(url, {useNewUrlParser: true});

/// Conection container 
const wordone = process.env.WORDONE;

/// Use modules
/// Users sesions configuration
app.use(session({
    secret: wordone,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); /// init passport 
app.use(passport.session()); /// passport handle sessions

/// Initial schema for the databe

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose); // seting the userchema as a mongoose local plugin

const User = new mongoose.model("User",userSchema); /// Mongoose model
/// Passport module configurations
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/// REQUESTS

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/register",(req,res)=>{
    console.log("register working");
    res.send("WORKING");
});

app.post("/register",(req,res)=>{
    // Create the new users.
    User.register({username: req.body.username},req.body.password,(e,user)=>{
        if(e){
            console.log(e);
            res.redirect("/reister"); ///In case of error return to the register page
        }else{
            passport.authenticate("local")(req,res,()=>{ /// Authenticate and begin a session
                res.send("SUCESSFULLY LOGIN"); ///
            });
        }

    });
});

app.post("/login",(req,res)=>{
    passport.authenticate("local")(req,res,function() { /// Authenticate and begin a session
        res.send("SUCESSFULLY LOGIN");
      });
});



const port = process.env.PORT;

app.listen(port, function() {
    console.log("Server now is Listen");
});