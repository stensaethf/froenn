var LocalStrategy = require('passport-local').Strategy,
    mongoose      = require('mongoose'),
    User          = mongoose.model('User');

module.exports = function(passport){
  passport.use('user', new LocalStrategy(
    function(email, password, done) {
      // make email lowercase
      email = email.toLowerCase();
      User.findOne({
        email: email
      },function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          console.log('no user');
          return done(null, false, { message: 'Incorrect email.' });
        }

        if (!user.authenticate(password)) {
          console.log('bad password');
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  return passport;
};