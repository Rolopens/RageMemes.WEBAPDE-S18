// packages
const crypto = require("crypto");
const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const auth = require("../middleware/auth")
const hbs = require('hbs');
const path = require('path');

const app = express()

const urlencoder = bodyparser.urlencoded({
  extended : true
})

// upload packages
const multer = require("multer")
const fs = require("fs")

// custom packages
const moment = require("moment")

// defined in model
const {Post} = require("../model/Post.js");
const {User} = require("../model/User.js");

// uploading
const UPLOAD_PATH = path.resolve(__dirname, "resources");
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

// handlebars helpers
hbs.registerHelper('formatDate', function(dateString) {
    return new hbs.SafeString(
        moment(dateString).format("MMMM DD, YYYY")
    );
});
hbs.registerHelper('ifLast', function(index, limit, options) {
   if(index !=0 && ((index + 1) % limit) == 0){
      return options.fn(this);
   } else {
      return options.inverse(this);
   }
});

router.use(urlencoder)

/*-----------------------------------Rendering images-----------------------------------*/
router.get("/photo/:id", (req, res)=>{
  console.log(req.params.id)
    fs.createReadStream(path.resolve(UPLOAD_PATH, req.params.id)).pipe(res)
})

/*-----------------------------------Sign up-----------------------------------*/
router.get('/signup', (req,res)=>{
    console.log("GET/ signup");
    res.render("signup.hbs") //static
})
router.post("/signingUp", urlencoder, upload.single("img"), (req, res)=>{
    console.log("POST/ signingup");
    var username = req.body.uname;
    var password = req.body.pword;
    var hashedpassword = crypto.createHash("md5").update(password).digest("hex");
    var email = req.body.email;
    var briefDescription = req.body.briefDescription;
    
    if(req.file){
        console.log(req.file.filename)
        var filename = req.file.filename;
        var originalfilename = req.file.originalfilename;
        var user = new User({
            username, password: hashedpassword, email, filename, originalfilename, briefDescription
        })
    }
    else{
        var user = new User({
            username, password: hashedpassword, email, briefDescription
        })
    }
    
    User.findOne({ 
        $or: [ { username: user.username}, { email: user.email } ] 
        }).then((existingUser)=>{
        if(existingUser){
            console.log("Error: Invalid username");
            res.render("signup.hbs", {
                message: "This user already exists. Please try again."
            });
        }
        else{
            user.save().then((doc)=>{                                            
            User.find().then((docs)=>{
                console.log(docs)
            })
            req.session.user = user;
            res.redirect("/"); 
        })
        } 
    });        
})
/*------------------------------------Login------------------------------------*/
router.get('/login', (req, res)=>{
    console.log("GET/ login");
    res.render("login.hbs"); //static
})
router.post("/authenticate", urlencoder, (req, res)=>{
    console.log("POST/ authenticate, login successful");
    var password = req.body.pword;
    var hashedpassword = crypto.createHash("md5").update(password).digest("hex");
    var email = req.body.email;
    var check = req.body.remember;
    
    User.findOne({
        email, password: hashedpassword
    }).then((user)=>{
        
        if(user){
            console.log(user.username);
            console.log(check);
            req.session.user = user;
            if (check == "on"){
                req.cookies.user = user;
            }
            
            Post.find({
                public : true
            }).then((results)=>{
                console.log("Logged in: " + req.session.user);
                res.redirect("/");
            }, ()=>{
                res.render("error.hbs");
            })
//        res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
        }
        else{
            res.render("login.hbs", {
                message: "Invalid credentials entered. Please try again."
            }); //static
        }
    })
})
/*------------------------------------Logout------------------------------------*/
router.get('/logout', (req, res)=>{
    console.log("GET/ logout");
    req.session.destroy();
    res.clearCookie("user");
    res.redirect("/");
})
/*-----------------------------------Viewing individual user pages-----------------------------------*/
router.get('/:id', (req, res)=>{
    console.log("GET/ User accessed: " + req.params.id);
    User.findOne({username: req.params.id}).then((user2)=>{
        if(req.session.user && req.session.user.username == user2.username){
            Post.find({
            user : user2
        }).limit(5).sort({
            date : -1
        }).populate('user').then((results)=>{
             res.render("userProfilePublic.hbs", {
                 user: req.session.user,
                 user2,
                 limit: 5,
                 nextLimit: 10,
                 results
             });
         })  
        }else{
            Post.find({
            $and : [{user : user2}, {public: true}]
        }).limit(5).sort({
            date : -1
        }).populate('user').then((results)=>{
             res.render("userProfilePublic.hbs", {
                 user: req.session.user,
                 user2,
                 limit: 5,
                 nextLimit: 10,
                 results
             });
         })
        } 
    })       
})
/*-----------------------------------View more-----------------------------------*/
router.get(':id/view/:lim', urlencoder, (req, res)=>{
    console.log("GET/ User view");
    var limit = parseInt(req.params.lim, 10);
    var nextLimit = limit + 5;
    User.findOne({username: req.params.id}).then((user2)=>{
        if(req.session.user && req.session.user.username == user2.username){
            Post.find({
            user : user2
        }).limit(5).sort({
            date : -1
        }).populate('user').then((results)=>{
             res.render("userProfilePublic.hbs", {
                 user: req.session.user,
                 user2,
                 limit,
                 nextLimit,
                 results
             });
         })  
        }else{
            Post.find({
            $and : [{user : user2}, {public: true}]
        }).limit(5).sort({
            date : -1
        }).populate('user').then((results)=>{
             res.render("userProfilePublic.hbs", {
                 user: req.session.user,
                 user2,
                 limit,
                 nextLimit,
                 results
             });
         })
        } 
    })       
})
/*-----------------------------------Editing individual user details-----------------------------------*/
router.post('/:id/edit', urlencoder, upload.single("img"), (req, res)=>{
    console.log("POST/ User accessed (edit): " + req.params.id);
    
    var email = req.body.email;
    var briefDescription = req.body.briefDescription;

    req.session.user.email = req.body.email;
    req.session.user.briefDescription = req.body.briefDescription;
    
    if(req.file){
        var filename = req.file.filename;
        var originalfilename = req.file.originalfilename;

        req.session.user.filename = req.file.filename;
        req.session.user.originalfilename = req.file.originalfilename;

         User.findOneAndUpdate({_id: req.params.id}, {filename, originalfilename, email, briefDescription}).then(
            res.redirect('/'));
    }
    else{
         User.findOneAndUpdate({_id: req.params.id}, {email, briefDescription}).then(
            res.redirect('/'));
    }
})

module.exports = router