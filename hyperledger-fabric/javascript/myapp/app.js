var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ck = require('cookie-session');
const session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
var testPage = require('./routes/test');

var app = express();
var exphbs  = require('express-handlebars');

// view engine setup
app.engine('.hbs', exphbs({
  helpers:{
    ifNot: function(v1, v2, options) {
      if(v1 != v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  },
  extname: '.hbs',
  defaultLayout: 'layout'
}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'login',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge:1000*60*60,
    secure:false
  }
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.use(function(req,res,next){
//   if (!req.session.username){
//     res.render('login',{title:'Login'});
//   }
// })
app.locals.login = 'true'
// console.dir(app.locals.login)
module.exports = app;
