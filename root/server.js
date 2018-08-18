// packages
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const crypto = require("crypto");

// upload
const multer = require("multer")
const fs = require("fs")

// defined in model
const {Post} = require("./model/Post.js");
const {User} = require("./model/User.js");

// create server, etc.
const app = express();
const urlencoder = bodyparser.urlencoded({
    extended: true
})


const UPLOAD_PATH = path.resolve(__dirname, "resources");
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

//sessions and cookies
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

// Post.remove({title: "Test2"}).then();



app.get('/tag', (req, res)=>{
    console.log("GET/");
    
    res.render("tag.hbs",{
        tagTitle: "Viewing posts tagged Anime"
    }, err=>{
        console.log(err);
    })
//    res.sendFile(path.join(__dirname, '/views/index1.html'));
})



app.post("/UploadMeme", urlencoder, (req, res)=>{
//    var title = req.body.title;
//    var description = req.body.description;
//    var tags = [];
//    
//    var anime = req.body.tag1.value;
//    var classic = req.body.tag2.checked;
//    var dank = req.body.tag3.checked;
//    var pinoy = req.body.tag4.checked;
//    var wholesome = req.body.tag5.checked;
//    if(anime == true){
//        tags.append("Anime");
//    }
//    if(classic == true){
//        tags.append("Classic");
//    }
//    if(dank == true){
//        tags.append("Dank");
//    }
//    if(pinoy == true){
//        tags.append("Pinoy");
//    }
//    if(wholesome == true){
//        tags.append("Wholesome");
//    }
//    
//    var public = req.body.Private.checked;
//    if(public == true){
//        public = false;
//    }
//    else{
//        public = true;
//    }
//    
//    var post = new Post({
//        title,
//        description,
//        user: req.session.user.username,
//        tags,
//        public
//    })
//    
//    post.save().then(()=>{
//        res.sendFile(path.join(__dirname, "/views/viewMeme/MinasMemes.html"));
//    })
})




/* this is where everything i'm touching is */


/*-----------------------------------Default-----------------------------------*/
app.get('/', (req, res)=>{
    req.session.user = null;
    console.log("GET/");
    Post.find({
        public : true
    }).then((results)=>{
       res.render("index.hbs", {
           results
       }); 
    }, ()=>{
        res.render("index.hbs");
    })
})
/*------------------------------------Home-------------------------------------*/
app.get('/home', (req, res)=>{
    console.log("GET/");
    res.redirect("/");
})
/*------------------------------------Login------------------------------------*/
app.get('/login', (req, res)=>{
    console.log("GET/ login.html");
    res.sendFile(path.join(__dirname, '/views/login.html')); //static
})
app.post("/authenticate", urlencoder, (req, res)=>{
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
               res.render("indexLoggedIn.hbs", {
                   user: req.session.user,
                   results
               }); 
            }, ()=>{
                res.render("error.hbs");
            })
            
            
//        res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
        }
        else{
            res.sendFile(path.join(__dirname, '/views/login.html'));
        }
    })
})
/*-----------------------------------Sign up-----------------------------------*/
app.get('/signup', (req,res)=>{
    console.log("GET/ signup.html");
    res.sendFile(path.join(__dirname, '/views/signup.html')); //static
})
app.post("/signingUp", urlencoder, upload.single("img"), (req, res)=>{
  console.log(req.body.title)
  console.log(req.file.filename)
    var username = req.body.uname;
    var password = req.body.pword;
    var hashedpassword = crypto.createHash("md5").update(password).digest("hex");
    var email = req.body.email;
    var filename = req.file.filename;
    var originalfilename = req.file.originalname;
    var briefDescription = req.body.briefDescription;
    
    var user = new User({
        username, password: hashedpassword, email, filename, originalfilename, briefDescription
    })
    
    User.findOne({ 
        $or: [ { username: user.username}, { email: user.email } ] 
        }).then((existingUser)=>{
        if(existingUser){
            console.log("invalid username");
            res.sendFile(path.join(__dirname, '/views/signup.html'));
        }
        else{
            user.save().then((doc)=>{
            res.redirect("/"); 
        })
        } 
    });
})
/*-----------------------------------Viewing individual posts-----------------------------------*/
app.get('/meme/:id', (req, res)=>{
    console.log("GET/ ID accessed: " + req.params.id);
//    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme1.html"));
     Post.findOne({_id: req.params.id}).then((post)=>{
        res.render("post.hbs", {
            post,
            user: req.session.user
        })
    })
        
})
/*-----------------------------------Rendering-----------------------------------*/
app.get("/photo/:id", (req, res)=>{
  console.log(req.params.id)
//  Post.findOne({_id: req.params.id}).then((doc)=>{
    fs.createReadStream(path.resolve(UPLOAD_PATH, req.params.id)).pipe(res)
//  }, (err)=>{
//    console.log(err)
//    res.sendStatus(404)
//  })
})

///*-----------------------------------Uploading-----------------------------------*/
//app.post("/upload", upload.single("img"),(req, res)=>{
//  console.log(req.body.title)
//  console.log(req.file.filename)
//
//  // multer saves the actual image, and we save the filepath into our DB
//  var p = new Post({
//      title : req.body.title,
//      filename : req.file.filename,
//      originalfilename : req.file.originalname
//    })
//
//  p.save().then((doc)=>{
//      res.render("post.hbs", {
//        title : doc.title,
//        id : doc._id
//      })
//    })
//})



/* old stuff below /*









/*------------------------------------Tags-------------------------------------*/
app.get('/anime-tag', (req, res)=>{
    console.log("GET/ animeTagged.html");
    res.sendFile(path.join(__dirname, '/views/animeTagged.html'));
})

app.get('/classic-tag', (req, res)=>{
    console.log("GET/ classicTagged.html");
    res.sendFile(path.join(__dirname, '/views/classicTagged.html'));
})

app.get('/dank-tag', (req, res)=>{
    console.log("GET/ dankTagged.html");
    res.sendFile(path.join(__dirname, '/views/dankTagged.html'));
})

app. get('/pinoy-tag', (req, res)=>{
    console.log("GET/ pinoyTagged.html");
    res.sendFile(path.join(__dirname, "/views/pinoyTagged.html"));
})

app.get('/wholesome-tag', (req, res)=>{
    console.log("GET/ wholesomeTagged.html");
    res.sendFile(path.join(__dirname, "/views/wholesomeTagged.html"));
})
















/*OLD*/



/*--------------------------------View Meme------------------------------------*/
app.get('/view-meme-1', (req, res)=>{
//    console.log("GET/ viewMeme/viewMeme1.html");
//    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme1.html"));
    Post.findOne({title: "Test2"}).then((post)=>{
        res.render("post.hbs", {
            post,
            user: req.session.user
        })
    })
        
})
app.get('/view-meme-2', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme2.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme2.html"));
})

app.get('/view-meme-3', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme3.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme3.html"));
})

app.get('/view-meme-4', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4.html"));
})

app.get('/view-meme-5', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5.html"));
})

app.get('/view-meme-6', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme6.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme6.html"));
})

app.get('/view-meme-7', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme7.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme7.html"));
})

app.get('/view-meme-8', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme8.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme8.html"));
})

app.get('/view-meme-9', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme9.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme9.html"));
})

app.get('/view-meme-10', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme10.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme10.html"));
})

app.get('/view-meme-11', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme11.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme11.html"));
})

app.get('/view-meme-12', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme12.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme12.html"));
})

app.get('/view-meme-13', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme13.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme13.html"));
})

app.get('/view-meme-14', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme14.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme14.html"));
})

app.get('/view-meme-15', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme15.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme15.html"));
})

/*---------------------(ERROR_HTML)Error Private Post--------------------------*/
app.get('/error-private-post', (req, res)=>{
    console.log("GET/ viewMeme/ErrorHtml/ErrorPrivatePost.html");
    res.sendFile(path.join(__dirname, "/views/ErrorHtml/ErrorPrivatePost.html"));
})

/************************************MINA***************************************/
/*------------------------------User Home Page---------------------------------*/
app.post('/user-home', urlencoder, (req, res)=>{
    console.log("POST/ indexLoggedIn");
    Post.find({
        public : true
    }).then((results)=>{
       res.render("indexLoggedIn.hbs", {
           user: req.session.user,
           results
       }); 
    }, ()=>{
        res.render("error.hbs");
    })
    
    //res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
})

app.get('/user-home', urlencoder, (req, res)=>{
    console.log("POST/ indexLoggedIn");
    Post.find({
        public : true
    }).then((results)=>{
       res.render("indexLoggedIn.hbs", {
           user: req.session.user,
           results
       }); 
    }, ()=>{
        res.render("error.hbs");
    })
    //res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
})

/*------------------------(ERROR_HTML)Minas Profile----------------------------*/
app.get('/mina-view-profile', (req, res)=>{
    console.log("GET/ viewMeme/ErrorHtml/MinasProfile.html");
    res.sendFile(path.join(__dirname, "/views/ErrorHtml/MinasProfile.html"));
})
/*----------------------------------Upload-------------------------------------*/
app.get('/user-upload', (req, res)=>{
    console.log('GET/ upload.html');
    res.sendFile(path.join(__dirname, "/views/upload.html"));
})
/*--------------------------------User Memes-----------------------------------*/
app.get('/user-profile', (req,res)=>{
//    console.log('GET/ viewMeme/MinasMemes.html');
//    res.sendFile(path.join(__dirname, "/views/viewMeme/MinasMemes.html"));
    Post.find({user: req.session.user.username}).then((results)=>{
        res.render("UserProfilePrivate.hbs", {
            results,
            user: req.session.user
        })
    })
})
/*--------------------------------Login Tags-----------------------------------*/
app.get('/anime-tag-login', (req, res)=>{
    console.log("GET/ animeTaggedLog.html");
    res.sendFile(path.join(__dirname, '/views/animeTaggedLog.html'));
})

app.get('/classic-tag-login', (req, res)=>{
    console.log("GET/ classicTaggedLog.html");
    res.sendFile(path.join(__dirname, '/views/classicTaggedLog.html'));
})

app.get('/dank-tag-login', (req, res)=>{
    console.log("GET/ dankTaggedLog.html");
    res.sendFile(path.join(__dirname, '/views/dankTaggedLog.html'));
})

app. get('/pinoy-tag-login', (req, res)=>{
    console.log("GET/ pinoyTaggedLog.html");
    res.sendFile(path.join(__dirname, "/views/pinoyTaggedLog.html"));
})

app.get('/wholesome-tag-login', (req, res)=>{
    console.log("GET/ wholesomeTaggedLog.html");
    res.sendFile(path.join(__dirname, "/views/wholesomeTaggedLog.html"));
})
/*----------------------------User View Meme-----------------------------------*/
app.get('/profile-view-meme-1', (req, res)=>{
//    console.log("GET/ viewMeme/viewMeme1-1.html");
//    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme1-1.html"));
    Post.findOne({title: "Test2"}).then((post)=>{
        res.render("post.hbs", {
            post,
            user: req.session.user
        })
    })
})

app.get('/profile-view-meme-2', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme2-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme2-1.html"));
})

app.get('/profile-view-meme-3', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme3-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme3-1.html"));
})
//Edit Meme
app.get('/profile-view-meme-3-edit', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme3-1Edit.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme3-1Edit.html"));
})

app.get('/profile-view-meme-4', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4-1.html"));
})
//Edit Meme
app.get('/profile-view-meme-4-edit', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4-1Edit.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4-1Edit.html"));
})
//Share Meme
app.get('/profile-view-meme-4-share', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4-1Share.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4-1Share.html"));
})

app.get('/profile-view-meme-5', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5-1.html"));
})
//Edit Meme
app.get('/profile-view-meme-5-edit', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5-1Edit.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5-1Edit.html"));
})
//Share Meme
app.get('/profile-view-meme-5-share', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5-1Share.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5-1Share.html"));
})
app.get('/profile-view-meme-6', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme6-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme6-1.html"));
})

app.get('/profile-view-meme-7', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme7-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme7-1html"));
})

app.get('/profile-view-meme-8', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme8-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme8-1.html"));
})

app.get('/profile-view-meme-9', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme9-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme9-1.html"));
})

app.get('/profile-view-meme-10', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme10-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme10-1.html"));
})
app.get('/profile-view-meme-11', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme11-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme11-1.html"));
})

app.get('/profile-view-meme-12', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme12-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme12-1.html"));
})

app.get('/profile-view-meme-13', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme13-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme13-1.html"));
})

app.get('/profile-view-meme-14', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme14-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme14-1.html"));
})

app.get('/profile-view-meme-15', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme15-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme15-1.html"));
})

app.get('/profile-view-meme-17', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme17-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme17-1.html"));
})

/***********************************TZUYU***************************************/
/*---------------------(ERROR_HTML)Error Not Logined---------------------------*/
app.get('/tzuyu-profile', urlencoder, (req, res)=>{
//    console.log(req.body.owner)
//    var owner = req.body.owner.value
//    
//    Post.find({user: owner}).then((results)=>{
//        User.findOne({username: owner}).then((user2)=>{
//            res.render("userProfilePublic.hbs", {
//            user1: req.session.user,
//            results,
//            user2
//            })
//        })
//        
//    })
    if(req.session.user){
        res.render("userProfilePublic.hbs",{
            user1: req.session.user
        })
    }else{
        res.render("userProfilePublic.hbs")
    }
//    res.sendFile(path.join(__dirname, "/views/ErrorHtml/ErrorNotLogged.html"));
})

app.get('/tzuyu-view-profile', urlencoder, (req, res)=>{
//    console.log(req.body.owner)
//    var owner = req.body.owner.value
//    Post.find({user: owner}).then((results)=>{
//        User.findOne({username: owner}).then((user2)=>{
//            res.render("userProfilePublic.hbs", {
//            user1: req.session.user,
//            results,
//            user2
//            })
//        })
//        
//    })
    console.log("GET/ viewUser.html");
    if(req.session.user){
        res.render("userProfilePublic.hbs",{
            user1: req.session.user
        })
    }else{
        res.render("userProfilePublic.hbs")
    }
//    res.sendFile(path.join(__dirname, "/views/viewUser.html"));
})

app.listen(3000, ()=>{
    console.log("Listening to port 3000");
})