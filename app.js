/// the   TOPMOST SHOULD HAVE THAT .env  TO KEEP OUR ENCRYPTED PASSWROS SECURE!!
//   require('dotenv').config();
//DO THIS and CREATE .env FILE TO STORE THE CONFEDENTIAL DOC
// DONOT GIT-COMMIT BEFORE
// COMMIT ONLY AFTER ADDING .env TO GITIGNORE
// Heroku has separate apne for addding these passwords encrytion so that it can handle it.


//~~~~~~~  HASHING ~~~~~~~~~??????????/////////////




const express = require("express");

const bodyPARSER= require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const bcrypt= require("bcrypt");// use bcrypt to secure passwords
const saltRounds = 10;

///const encrypt= require("mongoose-encryption");// to encrypt password
//const md5= require("md5");
const app= express();
const https= require("https");
/// https is used to get data from a external sserver
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/secret", {useNewUrlParser: true});
app.use(bodyPARSER.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/images', express.static('images'));

//we use mongooseSchmea as we need ````extra plugins``` etc.
const userSchema= new mongoose.Schema({

 email: String,
 password: String

});
const userSchemas= new mongoose.Schema({

 emails: String,
 passwords: String

});
//process.env.SECRET_PASSWORD gets our password from  .env  file   in which we assigned it our password
//var secret=process.env.SECRET_PASSWORD;
/////ENCRYPTION~~~~~~~~~~~~~~~~
// but this is very low level security
// encrptedFields: []  encryptonly certain fields otherwise itwil encrypt every info...
//userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });
// encrypts  at save();
// decrypts at finf();


// save the .gitignore file and add .env FILE IN GITIGNORE

const User= new mongoose.model("User", userSchema);


const Users= new mongoose.model("Users", userSchemas);

app.get("/", function(req, res)    {
   res.render("home");
});

app.get("/login", function(req, res) {
   res.render("login");
});
app.get("/logins", function(req, res) {
   res.render("logins");
});


app.get("/register", function(req, res) {
   res.render("register");
});
app.get("/registers", function(req, res) {
   res.render("registers");
});



app.post("/register", function (req,res) {


// provide th password as the 1st  paraameter /// from npm website
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      const newUser=new User({
        email: req.body.username,
        password:hash // this will HASH THE PASSSWORD when thry REGISTER

      });



       newUser.save(function (err) {

         if(!err){

      res.render("secrets");

         }


         else{
           console.log(err);
         }
       });





  });



});



app.post("/registers", function (req,res) {


// provide th password as the 1st  paraameter /// from npm website
  bcrypt.hash(req.body.passwords, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      const newUsers=new Users({
        emails: req.body.usernames,
        passwords:hash // this will HASH THE PASSSWORD when thry REGISTER

      });



       newUsers.save(function (err) {

         if(!err){

      res.render("secrets");

         }


         else{
           console.log(err);
         }
       });





  });






app.post("/login", function (req,res) {



 User.findOne({email: req.body.username},function(err,founduser){


   if(!err){//no error

      if(founduser){// foindd a user

        // Load hash from your password DB. fromm npm software
        ///HASHES ANDCOMPARES  FROM OUR DATABASE AFTER  SALTING AND BCRYPTIng
bcrypt.compare(req.body.password, founduser.password, function(err, result) {
    // result == true
    if(result===true){// match username's passwrod from DB(stored earlier) == to the req.body (enterd just now)

      res.render("secret");
    }
});
//  we hash the password again AS HASHING SAME THING GENERATES SAME HASH!  SO we can MATCH THE HASHES OF REGISTER AND LOGIN

      }

   }


   else{
     console.log(err);
   }

 });



});



app.post("/logins", function (req,res) {



 Users.findOne({email: req.body.usernames},function(err,founduser){


   if(!err){//no error

      if(founduser){// foindd a user

        // Load hash from your password DB. fromm npm software
        ///HASHES ANDCOMPARES  FROM OUR DATABASE AFTER  SALTING AND BCRYPTIng
bcrypt.compare(req.body.passwords, founduser.passwords, function(err, result) {
    // result == true
    if(result===true){// match username's passwrod from DB(stored earlier) == to the req.body (enterd just now)

      res.render("secrets");
    }
});
//  we hash the password again AS HASHING SAME THING GENERATES SAME HASH!  SO we can MATCH THE HASHES OF REGISTER AND LOGIN

      }

   }


   else{
     console.log(err);
   }

 });



});





app.listen(3000, function(){console.log("SERVER RUNNING AT  PORT 3000")  });
