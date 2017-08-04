var bCrypt = require('bcryptjs');

module.exports = (passport, user) => {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            var generateHash = (password) => {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            User.findOne({
                where: {
                    email: email
                }
            }).then((user) => {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already in use!'
                    });
                } else {
                    var userPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };
                    User.create(data).then((newUser, created) => {
                        if (!newUser) {
                            return done(null, false);
                        } else {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
};