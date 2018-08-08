const Tag = require("../model/Tag.js")

//anime tag
function getAnimeTag(req, res) {
    Tag.find({
        name: String
    }).then((results)=>{
        var user = req.session.name;
        if(name == Anime){
            res.render("tags.hbs",{
                results
            })
        }
        else{
            res.render("index.hbs",{
                results
            })
        }
        
    }), (err)=>{
        res.render("error.hbs")
    }
}