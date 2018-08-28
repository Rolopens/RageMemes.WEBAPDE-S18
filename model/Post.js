// create mongoose document posts 
const mongoose = require("mongoose");
const dateOnly = require("mongoose-dateonly")(mongoose);
var Schema = mongoose.Schema;

var User = require("../model/User.js");

var Comment = require("../model/Comment.js");
var CommentSchema = Comment.Comment.schema;

var PostSchema = new Schema({
    title : { type : String, required : true },
    filename : String,
    originalfilename : String,
    description : { type : String, required : true },
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tags : [String],
    date : { type: Date, default: Date.now },
    public : Boolean,
    permittedUsers : [String],
    comments : [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    likes : { type : Number, min : 0, default: 0 },
    usersLiked : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

var Post = mongoose.model("Post", PostSchema);

//remove this lter on
//module.exports = {
//    Post
//}

exports.uploadPost = function(post){
  return new Promise(function(resolve, reject){
    var p = new Post(post)
    p.save().then((newPost)=>{
      resolve(newPost)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getSharedWithMe = function(username){
  return new Promise(function(resolve, reject){
    Post.find({permittedUsers:username})
        .limit(5).sort({
            date: -1
        }).populate('user')
        .then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getOneViaPostId = function(id){
  return new Promise(function(resolve, reject){
    Post.findOne({_id:id})
        .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
            path: 'user',
            model: 'User'
        }
    }).populate('user')
        .then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.getViaTags = function(tag){
  return new Promise(function(resolve, reject){
    Post.find({tags:tag, public: true})
        .limit(5).sort({
            date: -1
        }).populate('user')
        .then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.editPost = function(id, title, description, tags, public){
  return new Promise(function(resolve, reject){

    Post.findOneAndUpdate({
        _id: id
    }, {
      title,
      description,
      tags,
      public
    }).then((newPost)=>{
        resolve(newPost);
    }, (err)=>{
        reject(err);
    })

  })
}
exports.sharePost = function(id, permittedUsers){
  return new Promise(function(resolve, reject){

    Post.findOneAndUpdate({
        _id: id
    }, {
      permittedUsers
    }).then((newPost)=>{
        resolve(newPost);
    }, (err)=>{
        reject(err);
    })

  })
}
exports.commentPost = function(id, c){
  return new Promise(function(resolve, reject){

    Post.findOneAndUpdate({
        _id: id
    }, {
        $push: {
            comments: c
        }
    }).then((newPost)=>{
        resolve(newPost);
    }, (err)=>{
        reject(err);
    })

  })
}
exports.deletePost = function(id){
  return new Promise(function(resolve, reject){
    Post.remove({
      _id : id
    }).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.getMyMemes = function(user2){
  return new Promise(function(resolve, reject){
    Post.find({
            $and : [{user : user2}, {public: true}]
        }).limit(20).sort({
            date : -1
        }).populate('user').then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.getMyMemesPublic = function(user2){
  return new Promise(function(resolve, reject){
    Post.find({user : user2}).limit(20).sort({
            date : -1
        }).populate('user').then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getAllPublic = function(){
  return new Promise(function(resolve, reject){
    Post.find({public: true})
        .limit(20).sort({
        date : -1
    }).populate('user')
        .then((posts)=>{
      resolve(posts)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getAllWithLimit = function(limit){
  return new Promise(function(resolve, reject){
    Post.find({public: true})
        .limit(limit).sort({
        date : -1
    }).populate('user')
        .then((posts)=>{
      resolve(posts)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getMyMemesWithLimit = function(user2, limit){
  return new Promise(function(resolve, reject){
    Post.find({
            $and : [{user : user2}, {public: true}]
        }).limit(limit).sort({
            date : -1
        }).populate('user').then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getMyMemesPublicWithLimit = function(user2, limit){
  return new Promise(function(resolve, reject){
    Post.find({user : user2}).limit(limit).sort({
            date : -1
        }).populate('user').then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.likePost = function(postId, userId){
  return new Promise(function(resolve, reject){
    Post.findOneAndUpdate({
        _id: postId
    }, {
        $inc: {
            likes: 1
        },
        $push: {
            usersLiked: userId
        }
    }).then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.unlikePost = function(postId, userId){
  return new Promise(function(resolve, reject){
    Post.findOneAndUpdate({
        _id: postId
    }, {
        $inc: {
            likes: -1
        },
        $pull: {
            usersLiked: userId
        }
    }).then((post)=>{
      console.log(post)
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}