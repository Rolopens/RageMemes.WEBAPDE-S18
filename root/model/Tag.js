// create mongoose document tag
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Post = require("../model/Post.js");
var PostSchema = Post.Post.schema;

var TagSchema = new Schema({
    tag: {type: String, required: true},
    posts: [PostSchema]
})

var Tag = mongoose.model('Tag', TagSchema);

module.exports = {
    Tag
}