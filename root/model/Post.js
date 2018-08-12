// create mongoose document posts 
const mongoose = require("mongoose");
const dateOnly = require("mongoose-dateonly")(mongoose);
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title : { type : String, required : true },
    image : Buffer, // not sure what the proper image type is
    description : { type : String, required : true },
    user : String,
    tags : [String],
    date : { type: dateOnly, default: Date.now },
    public : Boolean,
    permittedUsers : [String]
})

var Post = mongoose.model("Post", PostSchema);

module.exports = {
    Post
}