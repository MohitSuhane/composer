import User from '../models/user.model';
import ensureAuthenticated from '../helpers/user.auth';

const UserAuthRoute = (app, passport) => {

    app.get('/usernotfound/', function (req, res) {
        res.json({ 
            title: "Social Authentication",
            auth_status: false
            // status: req.session.passport ? req.session.passport.user || 'Logged out' : 'Not logged in'
         });
    });

    app.get('/account', ensureAuthenticated, function (req, res) {
        User.findById(req.session.passport.user, function (err, user) {
            if (err) {
                console.log(err);  // handle errors
            } else {
                res.json({ 
                    profileObj: user,
                    auth_status: true 
                });
            }
        });
    });

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: [
                'profile',
                'email'
            ]
        }
        ));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/playground/editor');
        });

    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: [
                'profile',
                'email'
            ]
        }
        ));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/playground/editor');
        });

    app.get('/auth/twitter',
        passport.authenticate('twitter', {
            scope: [
                'profile',
                'email'
            ]
        }
        ));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/playground/editor');
        });

    app.get('/auth/github',
        passport.authenticate('github', {
            scope: [
                'profile',
                'email'
            ]
        }
        ));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/playground/editor');
        });

    app.get('/logout', function (req, res) {
        req.logout();
        res.json({
            status: true
        })
    });

}

export default UserAuthRoute;