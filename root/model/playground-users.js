// create mongoose document posts 
const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 8,
        trim: true
    }, 
    email: String,
    post: String, 
    //tag: String,
})

var user = mongoose.model('User', userSchema);

module.exports = {
    user
}