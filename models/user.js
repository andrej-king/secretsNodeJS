const mongoose              = require('mongoose');
const passport              = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema                = mongoose.Schema;

const userSchema = new Schema({
	email: String,
	password: String,
	secret: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());