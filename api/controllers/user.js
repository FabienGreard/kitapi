const User = require('../models/user');
const setUserInfo = require('../_helpers/setUserInfo').setUserInfo;
const mailgun = require('../../config/mailgun');
const crypto = require('crypto');

//= =======================================
// User Routes
//= =======================================

exports.getById = function (req, res, next) {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }
    
    const userToReturn = setUserInfo(user);

    return res.status(200).json({ user: userToReturn });
  });
};

exports.getAll = function (req, res, next) {
  User.find((err, users) => {
    if (err) {
      res.status(400).json({ error: 'Something gone wrong.' });
      return next(err);
    }

    return res.status(200).json({ users: users });
  });
};

exports.delete = function (req, res, next) {
  if(req){
    User.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.status(400).json({ error: 'Something gone wrong.' });
        return next(err);
      }

      return res.status(200).json({ msg: "done" });
    });
  }
};

exports.update = function (req, res, next) {
  if(req){
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user, userUpdate) => {
      if (err) {
        res.status(400).json({ error: 'Something gone wrong.' });
        return next(err);
      }

      return res.status(200).json({ user: user });
    });
  }
};

exports.forgotPassword = function (req, res, next) {
  const email = req.body.email;

  User.findOne({ email }, (err, existingUser) => {
    // If user is not found, return error
    if (err || existingUser == null) {
      res.status(422).json({ error: 'Veuillez spécifier une adresse email valide.' }); //Your request could not be processed as entered. Please try again.
      return next(err);
    }

    resetPasswd = crypto.randomBytes(6).toString('hex');
    // If user is found, generate and save a password
    existingUser.password = resetPasswd;

    existingUser.save((err) => {
        // If error in saving password, return it
      if (err) { return next(err); }

      const message = {
        subject: 'Reset Password',
        text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please used this new password:\n\n' + `${resetPasswd}` + ''}`
      };

        //send user email via Mailgun
      mailgun.sendEmail(existingUser.email, message);

      return res.status(200).json({ message: 'Please check your email for new your password.' });
    });
  });
};
