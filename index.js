

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up default mongoose connection
const mongoDB = "mongodb://localhost/contactDB";
mongoose.connect(mongoDB, { useNewUrlParser: true });

// Set up the schema for mongoose
const contactSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String, 
    contacts: [{
        name: String,
        number: String,
        email: String
    }]
});

contactSchema.plugin(passportLocalMongoose);

// Initalize the model
const contact = new mongoose.model('Contact', contactSchema);

passport.use(contact.createStrategy());
passport.serializeUser(function(contact, done) {
    done(null, contact);
});
  
passport.deserializeUser(function(contact, done) {
    done(null, contact);
});


let user_id = null;
const defaultItems = [];
let showtable = 'table-show';

app.route("/")

.get(function(req, res) {
    if (req.isAuthenticated()){
        res.redirect("/contact");
    } else{
    res.render("home");}
})

.post(passport.authenticate("local"), function(req, res) { 

    console.log("Auth request received");
    user_id = req.user._id;
    console.log(user_id);
    
    res.redirect("/contact");
});

app.get("/contact", function(req, res) {
    if (req.isAuthenticated()){
        contact.findOne({_id:user_id}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                if(foundUser.contacts.length > 0){
                    showtable = 'table-show';
                    res.render("contact", {contacts: foundUser.contacts, sTable: showtable});
                } else {
                    showtable = 'table-hide';
                    res.render("contact", {contacts: defaultItems, sTable: showtable});
                }   
            }}
        }); 
    }
    else{
        res.redirect("/");
    }
    
});

app.route("/register")
.get(function(req, res) {
    res.render("register");
})

.post(function(req,res) {
    console.log("Post request received");
    let email = req.body.email;
    let password = req.body.password;
    let secret = req.body.secret;
    contact.register({username: email, secret: secret}, password, function (err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            res.redirect("/");
        }
    });
});

app.post("/addContact", function(req,res){
    console.log("Get request received");
    let name = req.body.name;
    let number = req.body.number;
    let email = req.body.email;

    contact.findByIdAndUpdate(user_id,{$push : {contacts:{"name": name, "number": number, "email":email}}},  function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Contact added");
            res.redirect("/contact");
        }
    });

});

app.get("/logout", function(req,res){
    console.log("Logout request received");
    user_id = null;
    req.logout();
    res.redirect("/");
});

app.post("/deleteContact", function(req,res){
    console.log("Delete request received");
    contact.findByIdAndUpdate(user_id, {$pull: {contacts: {_id:req.body.id}}}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Contact deleted");
            res.redirect("/contact");
        }
    });
});

app.listen(3000, function() {console.log("Server started on port 3000");});


// 885621435326-dplvk0djmv28tlq0m1mdkj4920gbcbo5.apps.googleusercontent.com

// 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