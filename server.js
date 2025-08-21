require("dotenv").config();

const express = require("express");
const app = express();

app.set('view engine', 'ejs');

const mongoose = require("mongoose");
const methodOverride = require("method-override");
// logging middleware
const morgan = require("morgan");
const session = require('express-session');

// Set the port from environment variable or default to 3000
const port = process.env.PORT || 3000;
const Project = require('./models/project');

mongoose.connect(process.env.MONGODB_URI);

// Listen for the 'connected' event. 
// .on is similar to addEventListener in the DOM
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to "serve"/return static assets, e.g., stylesheets,
// when requested by the browser.
// 'public' is the folder name that all static assets will be saved in.
app.use(express.static('public'));
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Sessions are how the server "remembers" which
// user the curren request is from
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// If a user is logged in, add the user's doc to req.user and res.locals.user
app.use(require('./middleware/add-user-to-req-and-locals'));


// Routes below

// GET / (root/default) -> Home Page
app.get('/', async (req, res) => {
  try {
    const featuredProjects = await Project.find().limit(5);
    res.render('home.ejs', { featuredProjects });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/about', (req, res) => {
  res.render('about');
});

// The '/auth' is the "starts with" path.  The
// paths defined in the router/controller will be
// appended to the "starts with" path
app.use('/auth', require('./controllers/auth'));

app.use('/projects', require('./controllers/projects'));


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

