const Post = require("./model/Post.js").model("Post")

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
    });
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
    });
}