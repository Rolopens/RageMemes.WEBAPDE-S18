// create mongoose document posts 
const mongoose = require("mongoose");

var PostSchema = mongoose.Schema({
    title : { type : String, required : true },
    image: Buffer, // not sure what the proper image type is
    description : { type : String, required : true },
    user: String,
    tag: [String],
    date: { type: Date, default: Date.now },
    public: Boolean,
    permittedUsers: [String]
})

var Post = mongoose.model("Post", PostSchema);

module.exports = {
    Post
}