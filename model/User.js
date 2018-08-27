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
//module.exports = {
//    User
//}

exports.create = function(user){
  return new Promise(function(resolve, reject){
    console.log(user)
    var u = new User(user) 
    u.save().then((newUser)=>{
      console.log(newUser)
      resolve(newUser)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.authenticate = function(email, pass){
  return new Promise(function(resolve, reject){
    User.findOne({
      email,
      password : pass
    }).then((user)=>{
      resolve(user)
    },(err)=>{
      reject(err)
    })
  })
}

exports.getOne = function(username1, email1){
  return new Promise(function(resolve, reject){
    User.findOne({ 
        $or: [ { username: username1}, { email: email1 } ] 
        }).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.getOneViaId = function(username){
  return new Promise(function(resolve, reject){
    User.findOne({username}).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.editAccountWithFile = function(id, filename, originalfilename, email, briefDescription){
  return new Promise(function(resolve, reject){
    User.findOneAndUpdate({_id:id}, {filename,   originalfilename, email, briefDescription}).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.editAccount = function(id, email, briefDescription){
  return new Promise(function(resolve, reject){
    User.findOneAndUpdate({_id:id}, {email, briefDescription}).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}