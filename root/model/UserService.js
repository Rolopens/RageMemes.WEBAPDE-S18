const User = require("../model/User.js")

//function addUser(user){
//    user.save().then((doc)=>{
//        res.redirect("/");
//    }, (err)=>{
//        console.log(err);
//    })
//}

function authenthicate(user){
    User.findOne({
        email: user.email,
        password: user.password
    }).then((user)=>{
//        res.redirict("loggedInHome.hbs", {
//            user
//        })
        res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
    })
}

function checkUsernameAndAdd(user){
    User.findOne({
        username: user.username
    }).then((existingUser)=>{
        if(existingUser){
            console.log("invalid username");
            res.sendFile(path.join(__dirname, '/views/signup.html'));
        }
        else{
            user.save().then((doc)=>{
            res.redirect("/"); 
        })
        } 
    });
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