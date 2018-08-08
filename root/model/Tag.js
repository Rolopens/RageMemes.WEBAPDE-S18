// create mongoose document tag
const mongoose = require("mongoose");

var tagSchema = mongoose.Schema({
    user: String, 
    post: String,
})

var tag = mongoose.model('Tag', postSchema);

module.exports = {
    tag
}