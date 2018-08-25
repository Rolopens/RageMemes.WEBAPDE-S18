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

module.exports = {
    Post
}