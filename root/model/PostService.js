const Post = require("../model/Post.js")

function addPost(post) {
    post.save().then(()=>{
        console.log("Uploaded Meme");
        res.redirect("/");
    }, (err)=>{
        console.log(err);
    })
}

function editPost(post){
    Post.findOneAndUpdate({
        _id: post._id
    }, post).then(()=>{
        console.log("Update Success!")
        resp.redirect("/");
    })
}

function deletePost(post){
    Post.remove({
        _id: post._id
    }).then(()=>{
        console.log("Deleted!")
        resp.redirect("/");
    })
}

function getPublicMemes(req, res) {
    Post.find({
        public:true
    }).then((results)=>{
        var user = req.session.user;
        if(user) {
            res.render("indexLoggedIn.hbs", {
                results
            })
        }
        else {
            res.render("index.hbs",{
                results
            })
        }
    }), (err)=>{
        res.render("error.hbs")
    }
}

function getPrivatelySharedMemes(user, req, res) {
    Post.find({
        public:false,
        permittedUsers:'Mina' // this is a test
    }).then((results)=>{
        var user = req.session.user;
        if(user) {
            res.render("indexLoggedIn.hbs", {
                results
            })
        }
        else {
            res.render("index.hbs",{
                results
            })
        }
    }), (err)=>{
        res.render("error.hbs")
    };
}