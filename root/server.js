const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
//const {user} = require("./model/user.js");

//connecting to mongoos database
//Promise Library
mongoose.Promise = global.Promise;

//connect to the database
mongoose.connect("mongodb://localhost:27017/memesdata", {
    useNewUrlParser: true 
});

const app = express();
//app.set('view engine', 'hbs');
app.set('view engine', 'html');
// Calling public folder for the .ccs files
app.use(express.static('public'));

const urlencoder = bodyparser.urlencoded({
    extended: true
})

app.listen(3000, ()=>{
    console.log("Listening to port 3000");
})
/*-----------------------------------Default-----------------------------------*/
app.get('/', (req, res)=>{
    console.log("GET/");
    res.sendFile(path.join(__dirname, '/views/index.html'));
})
/*------------------------------------Home-------------------------------------*/
app.get('/home', (req, res)=>{
    console.log("GET/ index.html");
    res.sendFile(path.join(__dirname, '/views/index.html'));
})
/*------------------------------------Login------------------------------------*/
app.get('/login', (req, res)=>{
    console.log("GET/ login.html");
    res.sendFile(path.join(__dirname, '/views/login.html'));
})
/*-----------------------------------Sign-Up-----------------------------------*/
app.get('/signup', (req,res)=>{
    console.log("GET/ signup.html");
    res.sendFile(path.join(__dirname, '/views/signup.html'));
})
/*------------------------------------Tags-------------------------------------*/
app.get('/anime-tag', (req, res)=>{
    console.log("GET/ animeTagged.html");
    res.sendFile(path.join(__dirname, '/views/animeTagged.html'));
})

app.get('/classic-tag', (req, res)=>{
    console.log("GET/ classicTagged.html");
    res.sendFile(path.join(__dirname, '/views/classicTagged.html'));
})

app.get('/dank-tag', (req, res)=>{
    console.log("GET/ dankTagged.html");
    res.sendFile(path.join(__dirname, '/views/dankTagged.html'));
})

app. get('/pinoy-tag', (req, res)=>{
    console.log("GET/ pinoyTagged.html");
    res.sendFile(path.join(__dirname, "/views/pinoyTagged.html"));
})

app.get('/wholesome-tag', (req, res)=>{
    console.log("GET/ wholesomeTagged.html");
    res.sendFile(path.join(__dirname, "/views/wholesomeTagged.html"));
})

/*--------------------------------View Meme------------------------------------*/
app.get('/view-meme-1', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme1.html"));
})

app.get('/view-meme-2', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme2.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme2.html"));
})

app.get('/view-meme-3', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme3.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme3.html"));
})

app.get('/view-meme-4', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4.html"));
})

app.get('/view-meme-5', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5.html"));
})

app.get('/view-meme-6', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme6.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme6.html"));
})

app.get('/view-meme-7', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme7.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme7.html"));
})

app.get('/view-meme-8', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme8.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme8.html"));
})

app.get('/view-meme-9', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme9.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme9.html"));
})

app.get('/view-meme-10', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme10.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme10.html"));
})

app.get('/view-meme-11', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme11.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme11.html"));
})

app.get('/view-meme-12', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme12.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme12.html"));
})

app.get('/view-meme-13', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme13.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme13.html"));
})

app.get('/view-meme-14', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme14.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme14.html"));
})

app.get('/view-meme-15', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme15.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme15.html"));
})

/*---------------------(ERROR_HTML)Error Private Post--------------------------*/
app.get('/error-private-post', (req, res)=>{
    console.log("GET/ viewMeme/ErrorHtml/ErrorPrivatePost.html");
    res.sendFile(path.join(__dirname, "/views/ErrorHtml/ErrorPrivatePost.html"));
})

/************************************MINA***************************************/
/*------------------------------User Home Page---------------------------------*/
app.post('/user-home', urlencoder, (req, res)=>{
    console.log("POST/ loggedInHome.html");
    res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
})
app.get('/user-home', (req, res)=>{
    console.log("POST/ loggedInHome.html");
    res.sendFile(path.join(__dirname, "/views/loggedInHome.html"));
})
/*------------------------(ERROR_HTML)Minas Profile----------------------------*/
app.get('/mina-view-profile', (req, res)=>{
    console.log("GET/ viewMeme/ErrorHtml/MinasProfile.html");
    res.sendFile(path.join(__dirname, "/views/ErrorHtml/MinasProfile.html"));
})
/*----------------------------------Upload-------------------------------------*/
app.get('/user-upload', (req, res)=>{
    console.log('GET/ upload.html');
    res.sendFile(path.join(__dirname, "/views/upload.html"));
})
/*--------------------------------User Memes-----------------------------------*/
app.get('/user-profile', (req,res)=>{
    console.log('GET/ viewMeme/MinasMemes.html');
    res.sendFile(path.join(__dirname, "/views/viewMeme/MinasMemes.html"));
})
/*--------------------------------Login Tags-----------------------------------*/
app.get('/anime-tag-login', (req, res)=>{
    console.log("GET/ animeTaggedLog.html");
    res.sendFile(path.join(__dirname, '/views/animeTaggedLog.html'));
})

app.get('/classic-tag-login', (req, res)=>{
    console.log("GET/ classicTaggedLog.html");
    res.sendFile(path.join(__dirname, '/views/classicTaggedLog.html'));
})

app.get('/dank-tag-login', (req, res)=>{
    console.log("GET/ dankTaggedLog.html");
    res.sendFile(path.join(__dirname, '/views/dankTaggedLog.html'));
})

app. get('/pinoy-tag-login', (req, res)=>{
    console.log("GET/ pinoyTaggedLog.html");
    res.sendFile(path.join(__dirname, "/views/pinoyTaggedLog.html"));
})

app.get('/wholesome-tag-login', (req, res)=>{
    console.log("GET/ wholesomeTaggedLog.html");
    res.sendFile(path.join(__dirname, "/views/wholesomeTaggedLog.html"));
})
/*----------------------------User View Meme-----------------------------------*/
app.get('/profile-view-meme-1', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme1-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme1-1.html"));
})

app.get('/profile-view-meme-2', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme2-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme2-1.html"));
})

app.get('/profile-view-meme-3', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme3-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme3-1.html"));
})
//Edit Meme
app.get('/profile-view-meme-3-edit', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme3-1Edit.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme3-1Edit.html"));
})

app.get('/profile-view-meme-4', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4-1.html"));
})
//Edit Meme
app.get('/profile-view-meme-4-edit', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4-1Edit.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4-1Edit.html"));
})
//Share Meme
app.get('/profile-view-meme-4-share', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme4-1Share.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme4-1Share.html"));
})

app.get('/profile-view-meme-5', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5-1.html"));
})
//Edit Meme
app.get('/profile-view-meme-5-edit', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5-1Edit.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5-1Edit.html"));
})
//Share Meme
app.get('/profile-view-meme-5-share', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme5-1Share.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme5-1Share.html"));
})
app.get('/profile-view-meme-6', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme6-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme6-1.html"));
})

app.get('/profile-view-meme-7', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme7-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme7-1html"));
})

app.get('/profile-view-meme-8', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme8-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme8-1.html"));
})

app.get('/profile-view-meme-9', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme9-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme9-1.html"));
})

app.get('/profile-view-meme-10', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme10-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme10-1.html"));
})
app.get('/profile-view-meme-11', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme11-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme11-1.html"));
})

app.get('/profile-view-meme-12', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme12-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme12-1.html"));
})

app.get('/profile-view-meme-13', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme13-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme13-1.html"));
})

app.get('/profile-view-meme-14', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme14-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme14-1.html"));
})

app.get('/profile-view-meme-15', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme15-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme15-1.html"));
})

app.get('/profile-view-meme-17', (req, res)=>{
    console.log("GET/ viewMeme/viewMeme17-1.html");
    res.sendFile(path.join(__dirname, "/views/viewMeme/viewMeme17-1.html"));
})

/***********************************TZUYU***************************************/
/*---------------------(ERROR_HTML)Error Not Logined---------------------------*/
app.get('/tzuyu-profile', (req, res)=>{
    console.log("GET/ viewMeme/ErrorHtml/ErrorNotLogged.html");
    res.sendFile(path.join(__dirname, "/views/ErrorHtml/ErrorNotLogged.html"));
})

app.get('/tzuyu-view-profile', (req, res)=>{
    console.log("GET/ viewUser.html");
    res.sendFile(path.join(__dirname, "/views/viewUser.html"));
})

