// create mongoose document posts 
const mongoose = require("mongoose");
var Post = require("mongoose").model("Post")
var PostSchema = Post.schema

var UserSchema = mongoose.Schema({
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