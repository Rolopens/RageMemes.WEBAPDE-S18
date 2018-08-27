// create mongoose document posts 
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = require("../model/User.js");

var CommentSchema = new Schema({
    text : { type : String, required : true },
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date : { type: Date, default: Date.now },
})

var Comment = mongoose.model("Comment", CommentSchema);

//remove this lter on
module.exports = {
    Comment
}
