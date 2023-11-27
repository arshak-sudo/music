var fs = require('fs');

var spawn = require('child_process').spawn;

var passport = require("passport");
var passportLocal = require("passport-local");

const flash = require("connect-flash");

var express = require('express');
var app = express();

var User = require(__dirname + '/FSAPI/Users');
var Audio = require(__dirname + '/FSAPI/Audios');
var Avatar = require(__dirname + '/FSAPI/Avatars');

var Categories = require(__dirname + '/FSAPI/Categories');

var Cookies = require(__dirname + '/FSAPI/Cookies');
var RememberMe = require(__dirname + '/FSAPI/RememberMe');

const port = process.env.port || 3001;

var bcrypt = require('bcrypt');

const sessions = require('express-session');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay * 10 },
    resave: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.static('public/pages'));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.set('Access-Control-Expose-Headers', 'field');
//     next();
// });

app.use(async function(req, res, next) {
  if (req.method == 'POST' && req.url == '/login') {
    if (req.body.remember_me) {
        await RememberMe.rememberCreate("true");
    }else{
        await RememberMe.rememberCreate("false");
    }
  }
  return next();
});

passport.use(new passportLocal.Strategy({

}, async (username, password, done) => {
    let users = await User.getTableData();
    let user = users.find((user) => user.username === username);
    if(user === undefined){
        return done(null, null, {message: "incorrect username"});
    }

    if(await bcrypt.compare(password, user.password)){
        return done(null, user);
    }

    done(null, null, {message: "incorrect password"});

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    let users = await User.getTableData();
    let user = users.find((user) => user.id === id);
    var remember_me = await RememberMe.get();
    user.remember_me = remember_me;
    done(null, user);
});

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

const uploadAvatar = multer({ storage: avatarStorage });
// =========================================================
function checkAuthentication(req, res, next){
    if(req.isAuthenticated() === false  && req.url !== '/login' &&  req.url !== '/register'){
        return res.redirect("/login");
    }
    if(req.isAuthenticated() === true  && req.url === '/login' || req.url === '/register'){
        return res.redirect("/");
    }
    next();
}

app.use(async (req, res, next) => {
    // console.log(req.isAuthenticated());
    var cookieUser = await Cookies.get("user");
    // console.log(req.user);
    if(req.isAuthenticated() === false && cookieUser !== null){
        req.login(cookieUser, function(err) {
            if (err) { return next(err); }
        });
    }
    if(req.isAuthenticated() === true &&  cookieUser === null){
        await Cookies.set("user", req.user);
        
    }
    return next();
});



app.use(checkAuthentication);

app.use(flash());



// =====================================================

app.get('/', async function(req, res, next) { 
    // console.log(req.isAuthenticated());
    return res.sendFile(__dirname + "/public/pages/main.html");
});

app.get("/delete-session", async (req, res) => {
    if(req.user.remember_me == "false"){
        await Cookies.remove("user");
    }
});

app.get('/login', async function(req, res) { 
    res.sendFile(__dirname + "/public/pages/login.html");
});
app.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), async (req, res, next) => {
    // user.remember_me = req.user.remember_me;
    
    
    // console.log(req.user);
    return next();
});
app.get('/register', async function(req, res) {
    let session=req.session;
    let user = session.user;
    if(!user && !req.cookies.user){
        res.sendFile(__dirname + "/public/pages/register.html");
    }else{
        return res.redirect("/home/ + user.id");
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
      // console.log(req.body.remember_me);
    }
    return res.json({success: true, id: id});
  }
});

app.get('/home', async function(req, res) {
    res.sendFile(__dirname + "/public/pages/home.html");
});

app.get('/home/:id', async function(req, res) {
    res.sendFile(__dirname + "/public/pages/home.html");
});


app.get('/session-user',  async function(req, res) {
    let user = req.user;
    if(user){
        return res.json(user);
    }else{
        return res.json(null);
    }
});

app.get('/account/:id', async function(req, res) {
    // console.log(req.params['id']);
   
    // console.log(req.isAuthenticated());
    res.sendFile(__dirname + "/public/pages/account.html");
});

app.post("/new-avatar", uploadAvatar.fields([{ name: 'avatar', maxCount: 1 }]), async function(req, res, next){
    let user_id = req.user.id;
    
    // console.log(req.cookies.user);
    var id = await Avatar.avatarCreate(user_id, req.files.avatar[0].originalname, "avatar");
    return res.redirect('/account/' + user_id);

});
app.get('/avatar/:user_id', async function(req, res) {
    const avatar = await Avatar.getTableDataByUserId(req.params['user_id']);
    return res.json(avatar);
});
app.get('/logout', async function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        Cookies.remove("user")
        res.redirect('/login');
    });
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
    return res.json(audio);
});

app.get('/listen/:id', async function(req, res) { 
    res.sendFile(__dirname + "/public/pages/listen.html");
});

// app.get('/is-liked/:audio_id',  async function(req, res) {
//     var status = await Like.isLiked(req.params["audio_id"], 1);
//     if(!status){
//         return res.json(false);
//     }else{
//         return res.json(true);
//     }
// });

app.get('/categories',  async function(req, res) {
    var categories = await Categories.get();
    if(!categories){
        return res.json(0);
    }else{
        return res.json(categories);
    }
});
// app.post('/like',  async function(req, res) {
//     // console.log(req.body);
//     var like = await Like.like(req.body.audio_id, req.body.user_id);
//     if(!like){
//         return res.json(false);
//     }else{
//         return res.json(true);
//     }
// });
// app.post('/unlike',  async function(req, res) {
//     var unlike = await Like.unlike(req.body.audio_id, req.body.user_id);
//     if(!unlike){
//         return res.json(false);
//     }else{
//         return res.json(true);
//     }
// });
app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})
