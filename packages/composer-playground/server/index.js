import path from 'path';
import express from 'express';
import logger from 'morgan';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import config from './config';
import passportStrategy from './helpers/passport.strategy';
import UserAuthRoute from './routes/user.auth.route';

// Setup app server
const app = express();

// Console the logger
if (config.env === 'development') {
  app.use(logger('dev'));
}

 app.use(require('webpack-dev-middleware')(webpack(require('../config/webpack.dev')({env: 'development'})))); 

// Middlewares
app.use(express.static(__dirname + '../dist'));
/* app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  */

// Connect mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo_url)
.then((result) => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB connection error", err);
});

// Set up passport strategy
passportStrategy(passport);

// Initialize passport and passport session
app.use(session({ 
    secret: 'passport_secret_key',
    resave: true,
    saveUninitialized: true
   }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

UserAuthRoute(app, passport); // Set up the passport authentication

// Route api
// Default - Route WildCard
// Composer Playground landing page
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
}); 

// Start Server
app.listen(config.port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening on ${config.base_url}`);
});