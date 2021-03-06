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
    extended: true
})

// upload packages
const multer = require("multer")
const fs = require("fs")

// custom packages
const moment = require("moment")

// defined in model
const Post = require("../model/Post.js");
//const {
//    User
//} = require("../model/User.js");
const {
    Comment
} = require("../model/Comment.js");

// uploading
const UPLOAD_PATH = path.resolve(__dirname, "resources");
const upload = multer({
    dest: UPLOAD_PATH,
    limits: {
        fileSize: 10000000,
        files: 2
    }
})

// handlebars helpers
hbs.registerHelper('formatDate', function (dateString) {
    return new hbs.SafeString(
        moment(dateString).format("MMMM DD, YYYY")
    );
});

router.use(urlencoder)
/*-----------------------------------Showing posts shared with user-----------------------------------*/
router.get('/:id/shared', (req, res) => {
    Post.getSharedWithMe(req.params.id)
        .then((results) => {
            res.render("index.hbs", {
                user: req.session.user,
                results
            });
        }, () => {
            res.render("error.hbs"); // should have "Results not found"
        })
})

/*-----------------------------------Rendering images-----------------------------------*/
router.get("/photo/:id", (req, res) => {
    console.log(req.params.id)
    fs.createReadStream(path.resolve(UPLOAD_PATH, req.params.id)).pipe(res)
})

/*------------------------------------Home-------------------------------------*/
router.get('/home', (req, res) => {
    console.log("GET/ home");
    res.redirect("/");
})

/*-----------------------------------Viewing individual posts-----------------------------------*/
router.get('/meme/:id', (req, res) => {
    console.log("GET/ Meme accessed: " + req.params.id);
    //    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme1.html"));
    Post.getOneViaPostId(req.params.id).then((post) => {
        console.log(post)
        
        var liked;
        if(req.session.user != null) {           
            for(i=0; i < post.usersLiked.length; i++){
        console.log(post.usersLiked[i]);
        console.log(req.session.user._id);
                if(post.usersLiked[i] == req.session.user._id){
                    liked = true;
                    break;
                 }
//                else{
//                    var liked = false;
//                }
            }
        }
        console.log(liked);
        
        if (post.public){
            if (req.session.user != null && (post.user.username === req.session.user.username)) {                
                res.render("post.hbs", {
                    post,
                    liked,
                    user: req.session.user,
                    equal: req.session.user
                })
            } else {
                res.render("post.hbs", {
                    post,
                    liked,
                    user: req.session.user
                })
            }
        } else {
            for(i=0; i < post.permittedUsers.length; i++){
//                console.log(post.permittedUsers[i] + "BIG TEST")
                if (req.session.user != null && post.permittedUsers[i] === req.session.user.username){
                        res.render("post.hbs", {
                            post,
                            liked,
                            user: req.session.user
                        }) 
                    break;
                 }
        
            }
            if (req.session.user != null && post.user.username === req.session.user.username) {
                res.render("post.hbs", {
                    post,
                    liked,
                    user: req.session.user,
                    equal: req.session.user
                })
            } else {
                res.render("error.hbs", {
                    user: req.session.user
                });
            }
        }
    })
})

/*-----------------------------------Uploading-----------------------------------*/
router.post("/upload", urlencoder, upload.single("img"), (req, res) => {
    console.log("POST/ upload");

    var title = req.body.title;
    var filename = req.file.filename;
    var originalfilename = req.file.originalfilename;
    var description = req.body.description;
    var user = req.session.user._id;
    var tags = [];
    var permittedUsers = [];

    if (req.body.public == 'Public') {
        var public = true;
    } else {
        var public = false;
    }

    if (req.body.tags) {
        var tagsTemp = (req.body.tags).replace(/  +/g, ' ');
        tagsTemp = tagsTemp.replace(/, /g, ',');
        tagsTemp = tagsTemp.replace(/ ,/g, ',');
        tagsTemp = tagsTemp.replace(/[^a-zA-Z0-9 .,]/g, "");
        var tags = tagsTemp.split(',');
    }
    if (req.body.permittedUsers) {
        var permittedUsersTemp = (req.body.permittedUsers).replace(/  +/g, ' ');
        permittedUsersTemp = permittedUsersTemp.replace(/, /g, ',');
        permittedUsersTemp = permittedUsersTemp.replace(/ ,/g, ',');
        permittedUsersTemp = permittedUsersTemp.replace(/[^a-zA-Z0-9 .,]/g, "");
        var permittedUsers = permittedUsersTemp.split(',');
    }

    var tags = tags.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })
    var permittedUsers = permittedUsers.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })

    var p = {
        title,
        filename,
        originalfilename,
        description,
        user,
        tags,
        public,
        permittedUsers
    }

    Post.uploadPost(p).then((doc) => {
        res.redirect("/")
    })
})
/*-----------------------------------Searching posts by tag-----------------------------------*/
router.post('/search', urlencoder, (req, res) => {
    console.log(req.body.searchInput);
    res.redirect('/post/search/' + req.body.searchInput);
})
/*-----------------------------------Searching posts by tag-----------------------------------*/
router.get('/search/:id', (req, res) => {
    Post.getViaTags(req.params.id)
        .then((results) => {
            res.render("index.hbs", {
                user: req.session.user,
                searchInput: req.params.id,
                results
            });
        }, () => {
            res.render("index.hbs", {
                user: req.session.user,
                searchInput: req.params.id,
                results
            });
        })
})
/*-----------------------------------Editing individual posts-----------------------------------*/
router.post('/meme/:id/edit', urlencoder, (req, res) => {
    console.log("POST/ Meme accessed (edit): " + req.params.id);

    var title = req.body.title;
    var description = req.body.description;
    var tags = [];

    if (req.body.tags) {
        var tagsTemp = (req.body.tags).replace(/  +/g, ' ');
        tagsTemp = tagsTemp.replace(/, /g, ',');
        tagsTemp = tagsTemp.replace(/ ,/g, ',');
        tagsTemp = tagsTemp.replace(/[^a-zA-Z0-9 .,]/g, "");
        var tags = tagsTemp.split(',');
    }

    if (req.body.public == 'Public') {
        var public = true;
    } else {
        var public = false;
    }

    var tags = tags.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })

    Post.editPost(req.params.id, title, description,
        tags, public).then(
        res.redirect('/post/meme/' + req.params.id));
})
/*-----------------------------------Sharing individual posts-----------------------------------*/
router.post('/meme/:id/share', urlencoder, (req, res) => {
    console.log("POST/ Meme accessed (share): " + req.params.id);

    var permittedUsers = [];

    if (req.body.permittedUsers) {
        var permittedUsersTemp = (req.body.permittedUsers).replace(/  +/g, ' ');
        permittedUsersTemp = permittedUsersTemp.replace(/, /g, ',');
        permittedUsersTemp = permittedUsersTemp.replace(/ ,/g, ',');
        permittedUsersTemp = permittedUsersTemp.replace(/[^a-zA-Z0-9 .,]/g, "");
        var permittedUsers = permittedUsersTemp.split(',');
    }

    var permittedUsers = permittedUsers.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })

    Post.sharePost(req.params.id, permittedUsers).then(
        res.redirect('/post/meme/' + req.params.id));
})
/*-----------------------------------Deleting individual posts-----------------------------------*/
router.post('/meme/:id/delete', urlencoder, (req, res) => {
    console.log("POST/ Meme accessed (delete): " + req.params.id);

    Post.deletePost(req.params.id
    ).then(
        res.redirect('/'));
})
/*-----------------------------------Commenting on individual posts-----------------------------------*/
router.post('/meme/:id/comment', urlencoder, (req, res) => {
    console.log("POST/ Meme accessed (comment): " + req.params.id);
    console.log(req.body.userComment);

    var text = req.body.userComment;
    var user = req.session.user._id;

    var c = new Comment({
        text,
        user
    })

    c.save();

    Post.commentPost(req.params.id , c).then(
        res.redirect('/post/meme/' + req.params.id));
})
/*-----------------------------------Liking and unliking individual posts-----------------------------------*/
router.get('/meme/:id/like', (req, res) => {
    Post.likePost(req.params.id, req.session.user._id).then(
        res.redirect('/post/meme/' + req.params.id));
})
router.get('/meme/:id/unlike', (req, res) => {
    Post.unlikePost(req.params.id, req.session.user._id).then(
        res.redirect('/post/meme/' + req.params.id));
})

module.exports = router
