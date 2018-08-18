// create mongoose document posts 
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Post = require("../model/Post.js");
var PostSchema = Post.Post.schema;

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
    briefDescription : String,
    filename : String,
    originalfilename : String
    //avatar : Buffer, // not sure what the proper image type is
//    posts : [PostSchema],
//    sharedPosts : [PostSchema] // redundant to permittedUsers in postSchema?
})

var User = mongoose.model("User", UserSchema);

module.exports = {
    User
}