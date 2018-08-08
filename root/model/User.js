// create mongoose document posts 
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Post = require("../model/Post.js");
var PostSchema = Post.Post.schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        // minlength: 8,
        trim: true
    },
    password: {
        type: String, 
        required: true,
        // minlength: 8,
        trim: true
    }, 
    email: String,
    avatar: Buffer, // not sure what the proper image type is
    posts: [PostSchema],
    sharedPosts: [PostSchema]
})

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}