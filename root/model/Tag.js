// create mongoose document tag
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {type: String, required: true}
})

var Tag = mongoose.model('Tag', TagSchema);

module.exports = {
    Tag
}