const express = require('express'),
      AuthenticationController = require('./controllers/auth'),
      passportService = require('../config/passport'),
      passport = require('passport');
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
        authRoutes = express.Router();

  // Uri page helper
  function index(uri, helpers, res){
    res.render('index', {title: uri, helpers: helpers})
  }

  // Index page
  app.get('/', function(req, res) { index('API', [{ title: '/api', subtitle: '/auth', line: ['/register', '/login']}], res) });

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes, function(req, res) { index('API - api/auth', [{ title: '/register', subtitle: 'Example :', line: ['{', '"email@gmail.com", // Must be unique', '"firstName": "MyFirstName",', '"lastName": "MyLastName",', '"password": "xxxxx",', '"role": "Member" // Optional', '}']}, {title: '/login', subtitle: 'Example :', line: [ '{', '"email": "email@gmail.com"', '"password": "xxxxx",', '}' ]}], res) });

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

// Set url for API group routes
  app.use('/api', apiRoutes, function(req, res) { index('API', [{ title: '/auth', subtitle: '', line: ['/register', '/login']}], res) });
};
