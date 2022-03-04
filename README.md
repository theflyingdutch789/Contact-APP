# Contact App

App created as per requirements for the interview in Zoho.  
Full stack contact App created Using Node JS, Express JS, Mongo DB, Mongoose JS and EJS.  
User authentication and Session Cookie implemented using Javascript Library Passport JS.
Passport Js uses pbkdf2 (sha256) for hashing the password and storing it in database.
Session cookies are maintained such that even if user changes tabs or goes anywhere after login, the user will stay authenticated and doesn't need to re-login. Session Cookies are valid till the browser closes.

Warning :- App won't login if a user account doesn't exist in the database. By default the app will route to "/" which is login page. Since Error messages are not implemented in this version, if a user doesnt exist in database, the app will keep re-routing after failed authentication to the login page. Create a account using Sign up button before proceeding to login.  

### Deployed App in Heroku Server
https://contact897-app.herokuapp.com/

### Usage

Clone the project in cli using 
```bash
git clone https://github.com/theflyingdutch789/Contact-APP.git
```
Install dependencies

```bash
npm install  
```

### Run Server

```bash
node index.js
```
Then open localhost:3000 in the brower to render the web-app.


### Test-cases

* If the username already exist in database, then it is not allowed to be created again.
* If the contact number already exist in database for the same user, then the contact is not allowed to be created again.

### Mongo-DB connection String
```
const mongoDB = "mongodb://localhost/contactDB";
mongoose.connect(mongoDB, { useNewUrlParser: true });
```

### User Schema
```
mongoose.Schema({
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
```

### Improvements

Front End can be changed to React for better styling and Efficiency.
Some error message needs to be displayed.
