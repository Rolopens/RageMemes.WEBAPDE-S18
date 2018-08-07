// create mongoose document posts 
const mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    user: String, 
    tag: String,
})

var post = mongoose.model('Post', postSchema);

module.exports = {
    post
}