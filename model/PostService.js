const Post = require("../model/Post.js")

function addPost(post) {
    post.save().then(()=>{
        console.log("Uploaded Meme");
        res.redirect("/");
    }, (err)=>{
        console.log(err);
    })
//    var query = post.save();
}

function editPost(post){
    Post.findOneAndUpdate({
        _id: post._id
    }, post).then(()=>{
        console.log("Update Success!")
        resp.redirect("/");
    })
//    var query = Post.findOneAndUpdate({_id:post._id}, post)
}

function deletePost(post){
    Post.remove({
        _id: post._id
    }).then(()=>{
        console.log("Deleted!")
        resp.redirect("/");
    })
//    var query = Post.remove({_id:post._id})
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
    // var query = Post.find({public: true});
    // return query
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
    // var query = Post.find({public: false, permittedUser: user.username});
    // return query
}

function getMyMemes(user, req, res) {
    Post.find({
        user: 'Mina' // this is a test. user.username?
    }).then((results)=>{
        var user = req.session.user;
        if(user) {
            res.render("userProfilePrivate.hbs", {
                results
            })
        }
        /* else {
            res.render(".hbs",{
                results
            })
        } */
    }), (err)=>{
        res.render("error.hbs")
    };
    // var query = Post.find({public: false, permittedUser: req.session.user.username});
    // return query
}