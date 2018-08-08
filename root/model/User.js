// create mongoose document posts 
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Post = require("../model/Post.js");
var PostSchema = Post.Post.schema;

var UserSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String, 
        required : true,
        trim : true
    }, 
    email : String,
    //avatar : Buffer, // not sure what the proper image type is
    briefDescription : String,
    posts : [PostSchema],
    sharedPosts : [PostSchema] // redundant to permittedUsers in postSchema?
})

var User = mongoose.model("User", UserSchema);

module.exports = {
    User
}