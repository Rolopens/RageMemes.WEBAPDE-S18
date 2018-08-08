const User = require("../model/User.js")


function authenthicate(user){
    User.findOne({
        email: user.email,
        password: user.password
    })
    .then((user)=>{
//        res.redirict("loggedInHome.hbs", {
//            user
//        })
        res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
    })
//    var query = User.findOne({email:user.email, password:user.password})
//    return query
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
//    var query = User.findOne({username:user.username, email:user.email})
//    return 
}
