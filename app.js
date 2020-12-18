require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT || 3000;
const app = express();

require('./models/db');
const mainRoute = require('./routes/main');
const errorRoute = require('./routes/404');

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

app.use(mainRoute);
app.use(errorRoute);

app.listen(PORT, () => {
	console.log(`${PORT} port is running`);
});