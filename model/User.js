// create mongoose document posts 
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var Post = require("../model/Post.js");
//var PostSchema = Post.Post.schema;

var UserSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        dropDups : true
    },
    password : {
        type : String, 
        required : true,
    }, 
    email : {
        type: String,
        required: true,
        unique : true,
        dropDups : true
    },
    joinDate : { type: Date, default: Date.now },
    briefDescription : String,
    filename : String,
    originalfilename : String
    //avatar : Buffer, // not sure what the proper image type is
//    posts : [PostSchema],
//    sharedPosts : [PostSchema] // redundant to permittedUsers in postSchema?
})

var User = mongoose.model("User", UserSchema);

//remove this later on
module.exports = {
    User
}

//exports.create = function(user){
//  return new Promise(function(resolve, reject){
//    console.log(user)
//    var u = new User(user)
//
//    u.save().then((newUser)=>{
//      console.log(newUser)
//      resolve(newUser)
//    }, (err)=>{
//      reject(err)
//    })
//  })
//}
//
//exports.authenticate = function(user){
//  return new Promise(function(resolve, reject){
//    console.log("in promise : " + user.username)
//    User.findOne({
//      username : user.username,
//      password : crypto.createHash("md5").update(user.password).digest("hex")
//    }).then((user)=>{
//      console.log("callback user : " + user)
//      resolve(user)
//    },(err)=>{
//      reject(err)
//    })
//  })
//}
//
//exports.get = function(id){
//  return new Promise(function(resolve, reject){
//    User.findOne({_id:id}).then((user)=>{
//      resolve(user)
//    }, (err)=>{
//      reject(err)
//    })
//  })
//}