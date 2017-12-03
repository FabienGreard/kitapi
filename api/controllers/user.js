const User = require('../models/user');
const setUserInfo = require('../_helpers/setUserInfo').setUserInfo;

//= =======================================
// User Routes
//= =======================================

exports.getById = function (req, res, next) {
  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
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
