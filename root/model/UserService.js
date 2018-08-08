const User = require("../model/User.js")

function addUser(user){
    user.save().then((doc)=>{
        res.sendFile(path.join(__dirname, '/views/index.html'));
    }, (err)=>{
        console.log(err);
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
        res.render("errror.hbs")
    });
}

function getPrivatelySharedMemes(user, req, res) {
    Post.find({
        public:false
        
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
        res.render("errror.hbs")
    });
}