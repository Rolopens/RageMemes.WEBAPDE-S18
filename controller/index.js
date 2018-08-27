const express = require("express")
const router = express.Router()
const app = express()
//const Post = require("../model/Post.js")

//// defined in model
const {Post} = require("../model/Post.js");
const {User} = require("../model/User.js");

// load all the controllers into router
router.use("/post", require("./Post.js"))
router.use("/user", require("./User.js"))

/*-----------------------------------Default-----------------------------------*/
router.get('/', (req, res)=>{
    if(req.cookies.user){
       req.session.user = req.cookies.user; 
    }
    
    
    User.find().then((docs)=>{
        console.log(docs)
    })
    Post.find().then((docs)=>{
        console.log(docs)
    })
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

module.exports = router