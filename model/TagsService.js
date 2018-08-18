const Tag = require("../model/Tag.js")
//create
//accepts tagname(string): name of tag
function addTag(tagname){
    var tag = new Tag({
        tag: tagname
    })
    tag.save().then(()=>{
        res.render("index.hbs");
    })
//    var query = tag.save();
}

//update
//accepts tag(string): name of tag
function addPostToTag(tagname, post){
    var check = Tag.findOne({tag: tagname}).then(()=>{
        check.posts.append(post);
        check.findOneAndUpdate({_id:check._id}, check).then(()=>{
            res.render("index.hbs")
        })
    })
//    var query = tag.findOne({tag: tagname}).then((tag)=>{
//        tag.posts.append(post)
//        tag.save()
//    })
    
}

//update
//accepts tag(string): name of tag
function deletePostFromTag(tagname, post){
    var check = Tag.findOne({tag: tagname}).then(()=>{
        check.posts.remove(post)
        check.findOneAndUpdate({_id:check._id}, check).then(()=>{
            res.render("index.hbs")
        })
    })
//    var query = tag.findOne({tag: tagname}).then((tag)=>{
//        tag.posts.remove(post)
//        tag.save()
//    })
}
    


//read
//accepts tagname(string): name of tag
function getPostsOfTag(tagname) {
    Tag.findOne({
        tag: tagname
    }).then((results)=>{
        res.render("tag.hbs",{
            results
        })
    }), (err)=>{
        res.render("error.hbs")
    }
}