const express = require('express');
const app = express();
const dataBase = require(__dirname + '/module/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')

//app.use(bodyParser)
app.use(bodyParser.json());//pakt data en maakt die beschikbaar onder req.body etc.
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'oh wow very secret much security',
    resave: true,
    saveUninitialized: false
}));

app.set('views',__dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static('static'));

//LANDING PAGE
app.get('/index', (req,res)=>{
	res.render('index');
});//get

//ADD_USER
app.get('/add_user', (req, res)=> {
  res.render('add_user')
});//get

//BOARD
app.get('/board', (req, res) => {
  const user = req.session.user
  if (user) {
    dataBase.Messages.findAll()
      .then(messages => {
        console.log('logging messages @ /board')
        console.log(messages)
        res.render('board', {Messages:messages}) 
    })//then
  }//if
  else{
    res.redirect('/index')

  }//esle
});//app.get

//Profile
app.get('/profile', (req, res)=>{
  const user = req.session.user.id
  if(user){
    res.render('profile', {user: user})
  }//if
  else {
    res.redirect('/index')
  }//esle
});//app.jet


//SINGLE POST
app.get('/posts', (req, res) => {
  console.log(req.query.id)
  var postId= req.query.id
  console.log(postId)

  dataBase.Messages.findOne({where: {id:postId},
  include: [
     { model: dataBase.Users},
     { model: dataBase.Comments}
  ]
  })//dataBase.Messages
  .then((message)=> {
    console.log(message)
    res.render('single_post', {message:message})
  })//then
});//app.get

//INDEX
app.post('/index', (request, response) => {
    if(request.body.userName.length === 0) {
        response.render('index', {
        message1: "Please fill out your email address."
    });//if
    return;

    }else if
        (request.body.password.length === 0) {
        response.render('index', {
        message2: "Please fill out your email password."
    });//res.render
    return;
    }//else if
      dataBase.Users.findAll(  
    ).then(function (user) {
        console.log(user)
        if(user) {
          console.log(user)
        }
        else {
          console.log('no user')
        }
          // bcrypt.compare(request.body.password, user.password, (err, result) => {
          //   if(result === true){
          //     request.session.user = user;
          //     response.redirect('profile');
          //     }//if 
          //   else {
          //     response.redirect('/index?message=' + encodeURIComponent("Invalid email or password."));
          //   }//else
          //     },  function (error) {
          //      response.redirect('/index?message=' + encodeURIComponent("Invalid email or password."));
          //     });//error
         });//then
});//post


//ADD_USER
app.post('/add_user', (request, response) => {
  bcrypt.hash(request.body.password, 8, function(err, hash) {
    if (err) { console.log(err) }//if
      let newUser = dataBase.Users.create({
          name: request.body.userName,
          email: request.body.email,
          password: hash
    }).then( (user) => {
      request.session.user = user;
      console.log('nu ook nog')
      response.redirect('board')
    })//then
  })
});//post

//BOARD POST MESSAGE
app.post('/message', (request,response)=> {
  var user = request.session.id
  if(user !== undefined){
    dataBase.Messages.create ({
    title: request.body.topic,
    message: request.body.message,
    userId: request.session.user.id

    }).then((message)=> {
      response.redirect('/board')
    })  //then
  } else {
    response.redirect('/index')
    }//else
});//app.post


//COMMENT
app.post('/comment', (req, res) => {
 //  console.log('///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////')
  dataBase.Comments.create ({
    comment: req.body.comment_body,
    userId: req.session.user.id,
    messageId : req.body.message_id
  }) //create
  .then((comment)=> {
    console.log('logging comment')
    console.log(comment)
    res.redirect('/posts?id=' + encodeURIComponent(comment.messageId))
  }) // then
});//post

//LISTEN
dataBase.connect.sync({force:true}).then((db)=> {
	db.authenticate()
  		.then(function(err) {
    		console.log('Connection has been established successfully.');
  		    }).then((DEFAULT_USER) => {
            dataBase.Users.create({
            name: "DEFAULT_USER",
            password: "DEFAULT_PASSWORD",
            email: "DEAFAULT_EMAIL"
           })//create
           })//then
  		      .catch(function (err) {
    		    console.log('Unable to connect to the database:', err);
  	     	}) //catch
      .then( () => {
			app.listen(3000, ()=> {
				console.log("Ready, set GO")
			});  //then
      })//then
});//connect.symc


//Find one, Post.findOne{
//   where messageid === usersid.
//   include module comment.(pakt autmatisch alle comments die hetzelfde message id hebben
//     )
//   wanneer je dit doet met een prmies krijg jee groot object waarin de post staat en oo de comments als values van keys.

// }
