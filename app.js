const express = require('express');
const bodyParser = require('body-parser');
// const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/secretDB',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

const secret = "thisismysupersecretkey";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get('/', (req, res) => {
	res.render('home', );
});

app.get('/register', (req, res) => {
	res.render('register', );
});

app.post('/register', (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	});

	newUser.save((error) => {
		if (error) {
			console.log(error);
		} else {
			res.render("secrets");
		}
	});
});

app.get('/login', (req, res) => {
	res.render("login");
});

app.post('/login', (req, res) => {
	const userName = req.body.username;
	const password = req.body.password;

	User.findOne({
		email: userName,
		password: password
	}, (error, userFound) => {
		if (error) {
			console.log(error);
		} else {
			console.log(userFound);
			console.log("password: " + password);
			if (userFound) {
				res.render("secrets");
			} else {
				res.render("login");
			}
		}
	});
});

app.get('/logout', (req, res) => {
	res.send('Logout page', );
});

app.get('/submit', (req, res) => {
	res.send('Submit page', );
});

app.listen(PORT, () => {
	console.log(`${PORT} port is running`);
});