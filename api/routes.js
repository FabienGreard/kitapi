const express = require('express'),
      AuthenticationController = require('./controllers/auth'),
      UserController = require('./controllers/user.js');
      passportService = require('../config/passport'),
      passport = require('passport'),
      passportService = require('../config/passport');

      // Constants for role types
      const REQUIRE_ADMIN = "Admin",
            REQUIRE_DEV = "Dev",
            REQUIRE_MEMBER = "Member";

// Middleware to require login/auth
  const requireAuth = passport.authenticate('jwt', { session: false });
  const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router();

  // Uri page helper
  function index(uri, helpers, res){
    res.render('index', {title: uri, helpers: helpers})
  }

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes, function(req, res) { index('API - api/auth', [{ title: '/register', subtitle: 'Example :', line: ['{', '"email@gmail.com", // Must be unique', '"firstName": "MyFirstName",', '"lastName": "MyLastName",', '"password": "xxxxx",', '"role": "Member" // Optional', '}']}, {title: '/login', subtitle: 'Example :', line: [ '{', '"email": "email@gmail.com"', '"password": "xxxxx",', '}' ]}], res) });

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  //authRoutes.post('/login', requireLogin, AuthenticationController.login);
  authRoutes.post('/login', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.status(401).send({ error: info.error }) }
      if (!user) { return res.status(401).send({ error: info.error }) }
      AuthenticationController.login(user, res, next)
    })(req, res, next);
  });

  //=========================
  // Users Routes
  //=========================

  // Set users routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/users', userRoutes, function(req, res) { index('API - api/users', [{ title: '/all', subtitle: 'Example :', line: ['Return a list of users','{', '"users": [', '{', '"_id": "xxxx",', '}', '{', '"_id": "xxxx",', '}', '}', ']']}, {title: '/:id', subtitle: 'Example :', line: [ 'Return one user', '{', '"email": "email@gmail.com"', '"password": "xxxxx",', '}' ]}, {title: '/:id', subtitle: 'Example :', line: [ 'Delete one user', '{', '"email": "email@gmail.com"', '"password": "xxxxx",', '}' ]}], res) });

  userRoutes.get('/all', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }
      UserController.getAll(req, res, next);
    })(req, res, next);
  });

  userRoutes.delete('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      UserController.delete(req, res, next);
    })(req, res, next);
  });

  userRoutes.put('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      UserController.update(req, res, next);
    })(req, res, next);
  });

// Set url for API group routes
  app.use('/', apiRoutes, function(req, res) { index('API', [{ title: '/auth', subtitle: '', line: ['/register', '/login']},{ title: '/users', subtitle: '', line: ['/', '/+id']}], res) });
};
