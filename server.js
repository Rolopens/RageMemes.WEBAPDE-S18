// packages
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const crypto = require("crypto");

// upload packages
const multer = require("multer")
const fs = require("fs")

// custom packages
const moment = require("moment")

// defined in model
const {Post} = require("./model/Post.js");
const {User} = require("./model/User.js");

// create server, etc.
const app = express();
const urlencoder = bodyparser.urlencoded({
    extended: true
})

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

// sessions and cookies
app.use(cookieparser());
app.use(session({secret : "MCO2", resave: true, saveUninitialized : true}));

// calling public folder for the .ccs files
    // app.use(express.static('public'));
app.use(express.static(__dirname + "/public"));
    // app.set('view engine', 'html');
app.set("view-engine", "hbs");

// connecting to mongoDB server; Promise Library
mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect("mongodb://localhost:27017/memesdata", {
    useNewUrlParser: true 
});





//mongoose.connect("mongodb://admin:r12345@ds123822.mlab.com:23822/ragememes", {
//    useNewUrlParser: true 
//});

//app.get("/", (req, res)=>{    
//    // get all meme posts
//    var Posts = Post.find().then((posts)=>{
//        res.render("index.hbs", {
//            posts
//        });
//    },()=>{
//        res.render("index.hbs");  
//    });
//});

//var post = new Post({
//        title: "Test2",
//        description: "Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
//        user: "Rolopens",
//        tags: ["Anime", "Dank"],
//        public: true
//    })
//    
//    post.save().then();




// Post.remove({public: true}).then();
// Post.remove({private: true}).then();
//    User.remove({username: "bbb"}).then();
//    User.find().then((docs)=>{
//        console.log(docs)
//    })




/* this is where everything i'm touching starts */


/*-----------------------------------Default-----------------------------------*/
app.get('/', (req, res)=>{
    Post.find().then((docs)=>{
        console.log(docs)
    })
    console.log(req.session.user + 'this is where the user is printed!!!!!!!!!!!!!!!!!!!!!!!');
    console.log("GET/ ");
    Post.find({
        public : true
    }).limit(20).sort({
        date : -1
    }).populate('user')
    .then((results)=>{
       res.render("index.hbs", {
           user: req.session.user,
           results
       }); 
    }, ()=>{
        res.render("index.hbs", {
            user: req.session.user
        });
    })
})
/*------------------------------------Home-------------------------------------*/
app.get('/home', (req, res)=>{
    console.log("GET/ home");
    res.redirect("/");
})
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
/*-----------------------------------Viewing individual posts-----------------------------------*/
app.get('/meme/:id', (req, res)=>{
    console.log("GET/ Meme accessed: " + req.params.id);
//    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme1.html"));
     Post.findOne({_id: req.params.id}).populate('user').then((post)=>{
        res.render("post.hbs", {
            post,
            user: req.session.user
        })
    })  
})
/*-----------------------------------Editing individual posts-----------------------------------*/
app.post('/meme/:id/edit', urlencoder, (req, res)=>{
    console.log("POST/ Meme accessed (edit): " + req.params.id);
    
    var title = req.body.title;
    var description = req.body.description; 
    var tags = [];
    
    if(req.body.tags) {
        var tagsTemp = (req.body.tags).replace(/  +/g, ' ');
        tagsTemp = tagsTemp.replace(/, /g,',');
        tagsTemp = tagsTemp.replace(/ ,/g,',');
        tagsTemp = tagsTemp.replace(/[^a-zA-Z0-9 ,]/g, "");
        var tags = tagsTemp.split(',');
    }

    if(req.body.public == 'Public'){
        var public = true;
    }
    else{
        var public = false;
    }
    
    var tags = tags.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
    
     Post.findOneAndUpdate({_id: req.params.id}, {title, description, tags, public}).then(
        res.redirect('/meme/' + req.params.id));
})
/*-----------------------------------Sharing individual posts-----------------------------------*/
app.post('/meme/:id/share', urlencoder, (req, res)=>{
    console.log("POST/ Meme accessed (share): " + req.params.id);
    
    var permittedUsers = [];
    
    if(req.body.permittedUsers) {
        var permittedUsersTemp = (req.body.permittedUsers).replace(/  +/g, ' ');
        permittedUsersTemp = permittedUsersTemp.replace(/, /g,',');
        permittedUsersTemp = permittedUsersTemp.replace(/ ,/g,',');
        permittedUsersTemp = permittedUsersTemp.replace(/[^a-zA-Z0-9 ,]/g, "");
        var permittedUsers = permittedUsersTemp.split(',');
    }
    
    var permittedUsers = permittedUsers.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
    
     Post.findOneAndUpdate({_id: req.params.id}, {permittedUsers}).then(
        res.redirect('/meme/' + req.params.id));
})
/*-----------------------------------Deleting individual posts-----------------------------------*/
app.post('/meme/:id/delete', urlencoder, (req, res)=>{
    console.log("POST/ Meme accessed (delete): " + req.params.id);
    
     Post.remove({_id: req.params.id}).then(
        res.redirect('/'));
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
/*-----------------------------------Searching posts by tag-----------------------------------*/
app.post('/search', urlencoder, (req, res)=>{
    console.log(req.body.searchInput);
    res.redirect('/search/' + req.body.searchInput);
})
app.get('/search/:id', (req, res)=>{
    Post.find({
        tags : req.params.id,
        public : true
    }).limit(20).sort({
        date : -1
    }).populate('user')
    .then((results)=>{
       res.render("index.hbs", {
           user: req.session.user,
           searchInput: req.params.id,
           results
       }); 
    }, ()=>{
        res.render("error.hbs"); // should have "Results not found"
    })
})
/*-----------------------------------Viewing posts by tag-----------------------------------*/
app.get('/tagged/:id', (req, res)=>{
    Post.find({
        tags : req.params.id,
        public : true
    }).limit(20).sort({
        date : -1
    }).populate('user')
    .then((results)=>{
       res.render("index.hbs", {
           user: req.session.user,
           searchInput: req.params.id,
           results
       }); 
    }, ()=>{
        res.render("error.hbs"); // should have "Results not found"
    })
})
/*-----------------------------------Rendering images-----------------------------------*/
app.get("/photo/:id", (req, res)=>{
  console.log(req.params.id)
    fs.createReadStream(path.resolve(UPLOAD_PATH, req.params.id)).pipe(res)
})
/*-----------------------------------Uploading-----------------------------------*/
app.post("/upload", urlencoder, upload.single("img"),(req, res)=>{
    console.log("POST/ upload");
    
    var title = req.body.title;
    var filename = req.file.filename;
    var originalfilename = req.file.originalfilename;
    var description = req.body.description;
    var user = req.session.user._id;        
    var tags = [];
    var permittedUsers = [];

    if(req.body.public == 'Public'){
        var public = true;
    }
    else{
        var public = false;
    }
    
    if(req.body.tags) {
        var tagsTemp = (req.body.tags).replace(/  +/g, ' ');
        tagsTemp = tagsTemp.replace(/, /g,',');
        tagsTemp = tagsTemp.replace(/ ,/g,',');
        tagsTemp = tagsTemp.replace(/[^a-zA-Z0-9 ,]/g, "");
        var tags = tagsTemp.split(',');
    }
    if(req.body.permittedUsers) {
        var permittedUsersTemp = (req.body.permittedUsers).replace(/  +/g, ' ');
        permittedUsersTemp = permittedUsersTemp.replace(/, /g,',');
        permittedUsersTemp = permittedUsersTemp.replace(/ ,/g,',');
        permittedUsersTemp = permittedUsersTemp.replace(/[^a-zA-Z0-9 ,]/g, "");
        var permittedUsers = permittedUsersTemp.split(',');
    }
    
    var tags = tags.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
    var permittedUsers = permittedUsers.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
    
    var p = new Post({
        title, filename, originalfilename, description, user, tags, public, permittedUsers
    })       
    
    p.save().then((doc)=>{
        res.redirect("/")
    })
})


 app.listen(3000, ()=>{
     console.log("Listening to port 3000");
 })

//app.listen(process.env.PORT || 3000)
