const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

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

// Initalize the model
const contact = mongoose.model('Contact', contactSchema);


let user_id;

app.get("/", function(req, res) {
    res.render("home");
});

app.post("/", function(req, res) { 

    console.log("Post request received");
    let email = req.body.email;
    let password = req.body.password;
    
    contact.findOne({email:email}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    user_id = foundUser._id;
                    res.redirect("/contact");
                } else {
                    res.send("Incorrect password");
                }
            } else {
                res.send("User not found");
            }
        }
    });
});

app.get("/contact", function(req, res) {
    res.render("contact");
    
    console.log(user_id);
    
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
    let newContact = new contact({
        email: email,
        password: password,
        secret: secret
    });
    newContact.save(function(err) {
        if(!err){
            console.log("Contact saved");
            res.redirect("/");
        }else{
            console.log(err);
        }
    });
});

app.post("/addContact", function(req,res){
    console.log("Get request received");
    let name = req.body.name;
    let number = req.body.number;
    let email = req.body.email;

    console.log(name);
    console.log(number);
    console.log(email);
    console.log(user_id);

    contact.findByIdAndUpdate(user_id,{$push : {contacts:{"name": name, "number": number, "email":email}}},  function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Contact added");
            res.redirect("/contact");
        }
    });

});

app.listen(3000, function() {console.log("Server started on port 3000");});