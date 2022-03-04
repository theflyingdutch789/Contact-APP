# Contact App

App created as per requirements for the interview in Zoho.  
Full stack contact App created Using Node JS, Express JS, Mongo DB, Mongoose JS and EJS.  
User authentication and Session Cookie implemented using Javascript Library Passport JS.
Passport Js uses pbkdf2 (sha256) for hashing the password and storing it in database

## Deployed App in Heroku Server
https://contact897-app.herokuapp.com/

## Usage

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

Front End can be changed to React for better styling and Efficency.
Some error message needs to be displayed.
