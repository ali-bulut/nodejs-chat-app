const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session=require('express-session');
const passport=require('passport');
const redisStore=require('./helpers/redisStore');

const cors=require('cors');

//for using .env file
const dotenv=require('dotenv');
dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const messagesRouter = require('./routes/messages');

const app = express();

//helpers
const db = require('./helpers/db')();

//middlewares
const isAuthenticated=require('./middleware/isAuthenticated');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

//express-session
app.use(session({
  store:redisStore,
  secret:process.env.SESSION_SECRET_KEY,
  resave:false,
  saveUninitialized:true,
  //maxAge -> session süresi (yazdığımız ifade 2 haftalık sürece denk geliyor)
  cookie:{maxAge: 14 * 24 * 3600000 }
}))

//passport.js
app.use(passport.initialize());
//sessionu passport.js'le kullanabilmemiz için bu lazım
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
//chatRouter çalışmadan önce isAuthenticated middleware'ini çalıştır dedik.
app.use('/chat', isAuthenticated, chatRouter);
app.use('/messages', messagesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
