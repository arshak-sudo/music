var fs = require('fs');

var express = require('express');
var app = express();

var User = require(__dirname + '/FSAPI/Users');
var Audio = require(__dirname + '/FSAPI/Audios');
var Avatar = require(__dirname + '/FSAPI/Avatars');

const port = process.env.port || 3001;

var bcrypt = require('bcrypt');

const sessions = require('express-session');
var cookieParser = require('cookie-parser');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay * 10 },
    resave: false
}));
app.use(cookieParser());


app.use(express.static('public'));
app.use(express.static('public/pages'));

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadAvatar = multer({ storage: avatarStorage })

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// =====================================================


app.get('/', async function(req, res) { 
    let session=req.session;
    let user = session.user;
    res.sendFile(__dirname + "/public/pages/main.html");
});
app.get('/login', async function(req, res) {  
    let session=req.session;
    let user = session.user;
    if(!user && !req.cookies.user){
      res.sendFile(__dirname + "/public/pages/login.html");
    }else{
      return res.redirect("/home");
    }
});
app.post('/login', async function(req, res) { 
    let session = req.session;
    
    if(!req.body.username.match("[A-Za-z0-9]{4,16}")){
      return res.json({error_code: 1});
    }else if(!req.body.password.match("[A-Za-z0-9]{4,16}")){
      return res.json({error_code: 2});
    }else{
      var userIsset = await User.userIsset(req.body.username, req.body.password);
      if(userIsset.userIsset){
        session.user = userIsset.user;
        if(req.body.rememberMe){
          res.cookie('user', JSON.stringify(userIsset.user), {expire: 360000 + Date.now()}); 
        }

        return res.json({success: true, id: userIsset.user.id});
      }else{
        return res.json({error_code: 3});
      }
      
    }
});
app.get('/register', async function(req, res) {
    let session=req.session;
    let user = session.user;
    if(!user && !req.cookies.user){
      res.sendFile(__dirname + "/public/pages/register.html");
    }else{
      res.redirect("/home/ + user.id");
    }
});
app.post('/register', async function(req, res) {
  let session=req.session;
  if(!req.body.firstName.match("[a-z]{3,55}")){
    return res.json({error_code: 1});
  }else if(!req.body.lastName.match("[a-z]{3,55}")){
    return res.json({error_code: 2});
  }else if(!req.body.username.match("[A-Za-z0-9]{4,16}")){
    return res.json({error_code: 3});
  }else if(!await User.usernameIsUniq(req.body.username)){
    return res.json({error_code: 4});
  }else if(!req.body.password.match("[A-Za-z0-9]{4,16}")){
    return res.json({error_code: 5});
  }else{
    var id = await User.userCreate(req.body.firstName, req.body.lastName, req.body.username, await bcrypt.hash(req.body.password, 10), "user", req.body.gender, req.body.date, req.body.rememberMe);
    var newUser = {
      id, 
      role: "user",
      ...req.body
    };
    session.user = newUser;
    if(req.body.rememberMe){
      res.cookie('user', JSON.stringify(newUser), {expire: 360000 + Date.now()}); 
    }
    return res.json({success: true, id: id});
  }
});

app.get('/home', async function(req, res) {
    let session=req.session;
    let user = session.user;
    if(user || req.cookies.user){
      res.sendFile(__dirname + "/public/pages/home.html");
    }else{
      return res.redirect("/");
    }
  	
});

app.get('/home/:id', async function(req, res) {
    let session=req.session;
    let user = session.user;
    if(user || req.cookies.user){
      res.sendFile(__dirname + "/public/pages/home.html");
    }else{
      return res.redirect("/");
    }
    
});


app.get('/session-user',  async function(req, res) {
    let session=req.session;
    let user = session.user;
    return res.json(user);
});
app.get('/cookie-user',  async function(req, res) {
    if(req.cookies.user){
      let user = JSON.parse(req.cookies.user);
      return res.json(user);
    }else{
      return res.json(false);
    }
});

app.get('/account/:id',  async function(req, res) {
    // console.log(req.params['id']);
    res.sendFile(__dirname + "/public/pages/account.html");
});
app.post("/new-avatar", uploadAvatar.fields([{ name: 'avatar', maxCount: 1 }]), async function(req, res, next){
    let user_id;
    if (!req.cookies.user) {
        user_id = req.session.user.id;
    }else{
        user_id = JSON.parse(req.cookies.user).id;
    }
    console.log(req.cookies.user);
    var id = await Avatar.avatarCreate(user_id, req.files.avatar[0].originalname, "avatar");
    res.redirect('/account/' + user_id);

});
app.get('/avatar/:user_id', async function(req, res) {
  // console.log(req.params['user_id']);
    const avatar = await Avatar.getTableDataByUserId(req.params['user_id']);
    console.log(avatar);
    
    return res.json(avatar);
});
app.get('/logout', async function(req, res) {
    let session=req.session;
    session.user = undefined;
    res.clearCookie('user');
    res.redirect("/");
});

app.get('/dashboard', async function(req, res) { 
    let session=req.session;
    let user = session.user;
    res.sendFile(__dirname + "/public/pages/dashboard.html");
});

app.post("/new-audio", upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'audio', maxCount: 8 }]), async function(req, res, next){
    // console.log(req.files.audio[0].originalname);
    // console.log(req.files.poster[0].originalname);
  var id = await Audio.audioCreate(req.body.title, req.body.singer, req.files.poster[0].originalname, req.files.audio[0].originalname, req.body.genre);
  res.redirect('/dashboard');

});

app.get('/audios', async function(req, res) { 
    var audios = await Audio.getTableData();
    return res.json(audios);
});

app.get('/audio/:id', async function(req, res) { 
    var audio = await Audio.getTableDataById(req.params.id);
    console.log(audio);
    return res.json(audio);
});

app.get('/listen/:id', async function(req, res) { 
    res.sendFile(__dirname + "/public/pages/listen.html");
});

app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})
