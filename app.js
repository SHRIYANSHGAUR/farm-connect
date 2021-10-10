const express = require("express");
const bodyPARSER= require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const encrypt= require("mongoose-encryption");// to encrypt password
const app= express();
const https= require("https");
/// https is used to get data from a external sserver
app.set('view engine', 'ejs');

mongoose.connect(" mongodb://localhost:27017/secret", {useNewUrlParser: true});
app.use(bodyPARSER.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/images', express.static('images'));

//we use mongooseSchmea as we need ````extra plugins``` etc.
const userSchema= new mongoose.Schema({

 email: String,
 password: String

});

/////ENCRYPTION~~~~~~~~~~~~~~~~
// but this is very low level security
const secret= "InformationTeachnology";
// encrptedFields: []  encryptonly certain fields otherwise itwil encrypt every info...
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });
// encrypts  at save();
// decrypts at finf();

const User= new mongoose.model("User", userSchema);



app.get("/", function(req, res)    {
   res.render("home");
});

app.get("/login", function(req, res) {
   res.render("login");
});

app.get("/register", function(req, res) {
   res.render("register");
});



app.post("/register", function (req,res) {

const newUser=new User({   email: req.body.username,  password: req.body.password});


 newUser.save(function (err) {

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

         if(founduser.password== req.body.password){// match username's passwrod from DB(stored earlier) == to the req.body (enterd just now)

           res.render("secrets");
         }
      }

   }


   else{
     console.log(err);
   }

 });



});






app.listen(3000, function(){console.log("SERVER RUNNING AT  PORT 3000")  });
