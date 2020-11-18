const express = require('express');
const bodyParser = require('body-parser');
// const ejs = require('ejs');
const mongoose = require('mongoose');
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

app.get('/', (req, res) => {
	res.render('home', );
});

app.get('/register', (req, res) => {
	res.render('register', );
});

app.get('/login', (req, res) => {
	res.send('Login page', );
});

app.get('/secrets', (req, res) => {
	res.render('secrets', );
});

app.get('/login', (req, res) => {
	res.send('Login page', );
});

app.get('/logout', (req, res) => {
	res.send('Logout page', );
});

app.get('/submit', (req, res) => {
	res.send('Submit page', );
});

app.post('/register', (req, res) => {
	console.log(req.body.username);
	console.log(req.body.password);
});

app.listen(PORT, () => {
	console.log(`${PORT} port is running`);
});