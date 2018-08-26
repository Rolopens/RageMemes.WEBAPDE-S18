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

/*------------------------------------Home-------------------------------------*/
app.get('/home', (req, res)=>{
    console.log("GET/ home");
    res.redirect("/");
})
/*-----------------------------------Default-----------------------------------*/
app.get('/', (req, res)=>{
    Post.find().then((docs)=>{
        console.log(docs)
    })
    console.log(req.session.user + 'this is where the user is printed!!!!!!!!!!!!!!!!!!!!!!!');
    console.log("GET/ ");
    Post.find({
        public : true
    })
    .limit(20).sort({
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
        tagsTemp = tagsTemp.replace(/[^a-zA-Z0-9 ,]/g, "");
        tagsTemp = tagsTemp.replace(' ,',',');
        tagsTemp = tagsTemp.replace(', ',',');
        var tags = tagsTemp.split(',');
    }
    if(req.body.permittedUsers) {
        var permittedUsersTemp = (req.body.permittedUsers).replace(/  +/g, ' ');
        permittedUsersTemp = permittedUsersTemp.replace(/[^a-zA-Z0-9 ,]/g, "");
        permittedUsersTemp = permittedUsersTemp.replace(' ,',',');
        permittedUsersTemp = permittedUsersTemp.replace(', ',',');
        var permittedUsers = permittedUsersTemp.split(',');
    }
    
    var p = new Post({
        title, filename, originalfilename, description, user, tags, public, permittedUsers
    })       
    
    p.save().then((doc)=>{
        res.redirect("/")
    })
})
/*-----------------------------------Searching posts by tag-----------------------------------*/
app.post('/search', urlencoder, (req, res)=>{
    console.log(req.body.searchInput);
    res.redirect('/search/' + req.body.searchInput);
})
/*-----------------------------------Searching posts by tag-----------------------------------*/
app.get('/search/:id', (req, res)=>{
    Post.find({
        tags : req.params.id,
        public : true
    })
        .limit(20).sort({
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

