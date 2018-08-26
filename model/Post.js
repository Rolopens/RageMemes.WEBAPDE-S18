// create mongoose document posts 
const mongoose = require("mongoose");
const dateOnly = require("mongoose-dateonly")(mongoose);
var Schema = mongoose.Schema;

var User = require("../model/User.js");
var UserSchema = User.User.schema;

var PostSchema = new Schema({
    title : { type : String, required : true },
    filename : String,
    originalfilename : String,
    description : { type : String, required : true },
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tags : [String],
    date : { type: Date, default: Date.now },
    public : Boolean,
    permittedUsers : [String]
})

var Post = mongoose.model("Post", PostSchema);

//remove this lter on
module.exports = {
    Post
}

//exports.addPost = function(post){
//  return new Promise(function(resolve, reject){
//    var p = new Post(post)
//
//    p.save().then((newPost)=>{
//      resolve(newPost)
//    }, (err)=>{
//      reject(err)
//    })
//  })
//}
//
//exports.get = function(id){
//  return new Promise(function(resolve, reject){
//    Post.findOne({_id:id, public: true}).then((post)=>{
//      console.log(post)
//      resolve(post)
//    }, (err)=>{
//      reject(err)
//    })
//  })
//}
//
//exports.getMyMemes = function(username){
//  return new Promise(function(resolve, reject){
//    Post.find({user: username}).then((post)=>{
//      console.log(post)
//      resolve(post)
//    }, (err)=>{
//      reject(err)
//    })
//  })
//}
//
//exports.getAll = function(){
//  return new Promise(function(resolve, reject){
//    Post.find({public: true}).then((posts)=>{
//      resolve(posts)
//    }, (err)=>{
//      reject(err)
//    })
//  })
//}
//
///*Allows those posts that were edited and changing privacy settings */
//exports.editPost = function(post){
//  return new Promise(function(resolve, reject){
//
//    Post.findOneAndUpdate({
//        _id: post._id
//    }, post).then((newPost)=>{
//        resolve(newPost);
//    }, (err)=>{
//        reject(err);
//    })
//
//  })
//}
//
//exports.delete = function(id){
//  return new Promise(function(resolve, reject){
//    Post.remove({
//      _id : id
//    }).then((result)=>{
//      resolve(result)
//    }, (err)=>{
//      reject(err)
//    })
//  })
//}
