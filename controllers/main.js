const mongoose  = require('mongoose');
const User      = new mongoose.model('User');
const passport  = require('passport');

exports.getMainPage = (req, res) => {
	res.render('home');
}

exports.getSecretPage = (req, res) => {
	if (req.isAuthenticated()) {
		User.find({"secret": {$ne: null}}, (error, usersFound) => {
			if (error) {
				console.log(error);
			} else {
				console.log(req.user);
				res.render('secrets', {userSecrets: usersFound});
			}
		})
	} else {
		res.redirect('login');
	}
}

exports.getRegisterPage = (req, res) => {
	res.render('register');
}

exports.postRegister = (req, res) => {
	let username = req.body.username.trim();
	let password = req.body.password.trim();
	if (username !== "" && password !== "") {
		User.register({username: username}, password, (error, user) => {
			if (error) {
				console.log(error);
				res.redirect('/register');
			} else {
				passport.authenticate('local')(req, res, () => {
					res.redirect('/secrets');
				})
			}
		})
	} else {
		res.redirect('/register');
	}
}

exports.getSubmitPage = (req, res) => {
	if (req.isAuthenticated()) {
		res.render('submit', );
	} else {
		res.redirect('/login');
	}
}

exports.postSubmitPage = (req, res) => {
	const submittedSecret = req.body.secret.trim();

	if (submittedSecret !== "") {
		User.findById(req.user.id, (error, userFound) => {
			if (error) {
				console.log(error);
			} else {
				userFound.secret = submittedSecret;
				userFound.save(() => {
					res.redirect('/secrets');
				});
			}
		});
	} else {
		res.redirect('/submit');
	}
}

exports.getLoginPage = (req, res) => {
	res.render("login");
}

exports.postLogin = (req, res) => {
	let username = req.body.username.trim();
	let password = req.body.password.trim();
	if (username !== "" && password !== "") {
		const user = new User({
			username: username,
			password: password
		});

		req.login(user, (error) => {
			if (error) {
				console.log(error);
			} else {
				passport.authenticate('local', function(err, user) {
					if (err) { console.log(err); }
					if (!user) { return res.redirect('/login'); }
					req.logIn(user, function(err) {
						if (err) { console.log(err); }
						return res.redirect('/secrets');
					});
				})(req, res);
			}
		});
	} else {
		res.redirect('/login');
	}
}

exports.getLogout = (req, res) => {
	req.logout();
	res.redirect('/');
}