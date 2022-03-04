
//Importing the required Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
//passport js (a js library) is used for authentication whose local strategy implements pbkdf2 for generating hashes(securing the password in database) and also for creating the session cookie
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//Using body parser to parse the data from html form
app.use(bodyParser.urlencoded({ extended: true }));
//Using public directory to render the static files(css,images)
app.use(express.static("public"));
//Using ejs as view engine for rendering the html files
app.set("view engine", "ejs");

//Using sessions to maintain session cookies
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: true
}));
//Initializing passport and session
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
    //Schema for array of objects to store the contacts
    contacts: [{
        name: String,
        number: String,
        email: String
    }]
});
//Using passport-local-mongoose to add the username and password to the schema
contactSchema.plugin(passportLocalMongoose);

// Initalize the model
const contact = new mongoose.model('Contact', contactSchema);
//Strategies are responsible for authenticating requests, which they accomplish by implementing an authentication mechanism.
//Using serializeUser determines which data of the user object should be stored in the session and is later used to retrieve the whole object via the deserializeUser function.
passport.use(contact.createStrategy());
passport.serializeUser(function(contact, done) {
    done(null, contact);
});
passport.deserializeUser(function(contact, done) {
    done(null, contact);
});

//User id created to store the user id after authentication from passport js, element exist is created to check if a contact already exist in the database.
//Showtable is created to determine whether to show the table of contacts if table is empty or not
let user_id = null;
const defaultItems = [];
let showtable = 'table-show';
let elementExist = false;


//Routes to handle the homepage which is the login page
app.route("/")

.get(function(req, res) {
    if (req.isAuthenticated()){
        res.redirect("/contact");
    } else{
    res.render("home");}
})
//passport.authenticate(a function of passport.js) is used to authenticate the user which retrieves the username from the login form and checks against the database and if user is found, the hashes of password is compared.
.post(passport.authenticate("local", { failureRedirect: '/' }), function(req, res) { 

    //In case of successful authentication using local strategy, the user id is stored in user_id variable and the user is redirected to the contact page
    //In case of failed authentication, the user is redirected to the login page
    user_id = req.user._id;    
    res.redirect("/contact");
});

//Routes to handle the Register page
app.route("/register")
.get(function(req, res) {
    res.render("register");
})

.post(function(req,res) {
    console.log("Register request received");
    let email = req.body.email;
    let password = req.body.password;
    let secret = req.body.secret;
    //.Register is a function from passport js which creates a new user in the database by hashing the password and storing the username and hashed password in the database
    contact.register({username: email, secret: secret}, password, function (err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            res.render("success");
        }
    });
});
//Routes to handle the contact page
app.get("/contact", function(req, res) {
    //isAuthenticated is a function from passport js which checks if the user is authenticated or not
    if (req.isAuthenticated()){
        contact.findOne({_id:user_id}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                
                if(foundUser.contacts.length > 0){
                    showtable = 'table-show';
                    res.render("contact", {contacts: foundUser.contacts, sTable: showtable});
                } else {
                    showtable = 'table-hide';
                    res.render("contact", {contacts: defaultItems, sTable: showtable});
                }   
            }
        }); 
    }
    else{
        res.redirect("/");
    }
    
});
//Routes to handle the when the add contact button is clicked
app.post("/addContact", function(req,res){
    console.log("Get request received");
    let name = req.body.name;
    let number = req.body.number;
    let email = req.body.email;

    contact.find({_id: user_id}, function (err, foundUser){
        if (err){
            console.log(err);
        }else{
            //Checking if the contact already exist in the database
            for (let i=0; i < foundUser.length; i++) {
                for(let j=0; j < foundUser[i].contacts.length; j++){
                    if (foundUser[i].contacts[j].number === number){
                        elementExist = true;
                    }
                }
            }
        }
        //If the contact does not exist in the database, then add it to the database
        if (elementExist == false){
            contact.findByIdAndUpdate(user_id,{$push : {contacts:{"name": name, "number": number, "email":email}}},  function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Contact added");
                    res.redirect("/contact");
                }
            });
        }//If the contact already exist in the database, then do not add it to the database
        else{
            console.log("Contact already exists");
            res.redirect("/contact");
        }
     });
});
//Routes to handle the when the logout button is clicked
app.get("/logout", function(req,res){
    console.log("Logout request received");
    user_id = null;
    req.logout();
    res.redirect("/");
});
//Routes to handle the when the delete checkbox is clicked
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
//Listeninig to the port 3000
app.listen(3000, function() {console.log("Server started on port 3000");});


