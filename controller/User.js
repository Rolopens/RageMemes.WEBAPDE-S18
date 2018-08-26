const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const Post = require("../models/post")

const app = express()

const urlencoder = bodyparser.urlencoded({
  extended : true
})

router.use(urlencoder)

/*-----------------------------------Sign up-----------------------------------*/
app.get('/signup', (req,res)=>{
    console.log("GET/ signup");
    res.sendFile(path.join(__dirname, '/views/signup.html')); //static
})
app.post("/signingUp", urlencoder, upload.single("img"), (req, res)=>{
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
            res.sendFile(path.join(__dirname, '/views/signup.html'));
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
app.get('/login', (req, res)=>{
    console.log("GET/ login");
    res.sendFile(path.join(__dirname, '/views/login.html')); //static
})
app.post("/authenticate", urlencoder, (req, res)=>{
    console.log("POST/ authenticate, login successful");
    var password = req.body.pword;
    var hashedpassword = crypto.createHash("md5").update(password).digest("hex");
    var email = req.body.email;
    
    User.findOne({
        email, password: hashedpassword
    }).then((user)=>{
        if(user){
            console.log(user.username);
            req.session.user = user;
            
            Post.find({
                public : true
            }).then((results)=>{
                console.log("Logged in: " + req.session.user);
               res.render("index.hbs", {
                   user: req.session.user,
                   results
               }); 
                res.redirect("/");
            }, ()=>{
                res.render("error.hbs");
            })
//        res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
        }
        else{
            res.sendFile(path.join(__dirname, '/views/login.html')); //static
        }
    })
})
/*------------------------------------Logout------------------------------------*/
app.get('/logout', (req, res)=>{
    console.log("GET/ logout");
    req.session.destroy();
    res.redirect("/");
})
/*-----------------------------------Viewing individual user pages-----------------------------------*/
app.get('/user/:id', (req, res)=>{
    console.log("GET/ User accessed: " + req.params.id);
    User.findOne({username: req.params.id}).then((user2)=>{
        Post.find({
            user : user2
        }).limit(20).sort({
            date : -1
        }).then((results)=>{
             res.render("userProfilePublic.hbs", {
                 user: req.session.user,
                 user2,
                 results
             });
         })
    })       
})