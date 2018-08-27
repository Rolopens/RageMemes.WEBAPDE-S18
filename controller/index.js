const express = require("express")
const router = express.Router()
const app = express()
//const Post = require("../model/Post.js")

//// defined in model
const Post = require("../model/Post.js");
const User = require("../model/User.js");

// load all the controllers into router
router.use("/post", require("./Post.js"))
router.use("/user", require("./User.js"))

const hbs = require('hbs');
hbs.registerHelper('ifLast', function(index, limit, options) {
   if(index !=0 && ((index + 1) % limit) == 0){
      return options.fn(this);
   } else {
      return options.inverse(this);
   }
});

const bodyparser = require("body-parser")
const urlencoder = bodyparser.urlencoded({
  extended : true
})

/*-----------------------------------Default-----------------------------------*/
router.get('/', (req, res)=>{
    if(req.cookies.user){
       req.session.user = req.cookies.user; 
    }
    
//    User.find().then((docs)=>{
//        console.log(docs)
//    })
//    Post.find().then((docs)=>{
//        console.log(docs)
//    })
    
    console.log("GET/ ");
    Post.getAllPublic().then((results)=>{
       res.render("index.hbs", {
           user: req.session.user,
           limit: 20,
           nextLimit: 40,
           results
       }); 
    }, ()=>{
        res.render("index.hbs", {
            user: req.session.user
        });
    })
})
/*-----------------------------------View more-----------------------------------*/
router.get('/view/:id', urlencoder, (req, res)=>{    
    console.log("GET/ view");
    var limit = parseInt(req.params.id, 10);
    var nextLimit = limit + 20;
//    console.log(limit);
    Post.getAllWithLimit(limit)
    .then((results)=>{
       res.render("index.hbs", {
           user: req.session.user,
           limit,
           nextLimit,
           results
       }); 
    }, ()=>{
        res.render("index.hbs", {
            user: req.session.user
        });
    })
})

module.exports = router