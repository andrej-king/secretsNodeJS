require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
//const encrypt = require('mongoose-encryption');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// initsialize session
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true
}))

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`mongodb://${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	secret: String
});

userSchema.plugin(passportLocalMongoose);

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', (req, res) => {
	res.render('home', );
});

app.get('/secrets', (req, res) => {
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
});

app.get('/register', (req, res) => {
	res.render('register', );
});

app.post('/register', (req, res) => {
	User.register({username: req.body.username}, req.body.password, (error, user) => {
		if (error) {
			console.log(error);
			res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, () => {
				res.redirect('/secrets');
			})
		}
	})
});

app.get('/submit', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('submit', );
	} else {
		res.redirect('/login');
	}
});

app.post('/submit', (req, res) => {
	const submittedSecret = req.body.secret;

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
});

app.get('/login', (req, res) => {
	res.render("login");
});

app.post('/login', (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password
	});

	req.login(user, (error) => {
		if (error) {
			console.log(error);
		} else {
			passport.authenticate("local")(req, res, () => {
				res.redirect('/secrets');
			});
			res.redirect('/login');
		}
	});

	// const userName = req.body.username;
	// const password = md5(req.body.password);
	//
	// User.findOne({
	// 	email: userName,
	// 	password: password
	// }, (error, userFound) => {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.log(userFound);
	// 		console.log("password: " + password);
	// 		if (userFound) {
	// 			res.render("secrets");
	// 		} else {
	// 			res.render("login");
	// 		}
	// 	}
	// });
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.listen(PORT, () => {
	console.log(`${PORT} port is running`);
});