require("dotenv").config();

const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("view cache", false);


const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());                         
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(
  morgan("dev", {
    skip: (req, res) =>
      req.path.startsWith("/.well-known") || res.statusCode === 304,
  })
);

app.use((req, res, next) => {
  res.locals.lang = req.cookies.lang === 'es' ? 'es' : 'en';
  next();
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});

app.use("/request-appointment", require("./controllers/appointments"));

app.get("/", (req, res) => res.render("home"));

app.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About Harmony Wellness Group | Tampa Clinic',
    pageDescription: 'Learn about Harmony Wellness Group in Tampa, Florida. Our care philosophy blends evidence-based rehabilitation with compassionate support.'
  });
});

app.get('/services', (req, res) => {
  res.render('services', {
    pageTitle: 'Services at Harmony Wellness Group | Tampa Clinic',
    pageDescription: 'Learn about services offered atHarmony Wellness Group in Tampa, Florida. Our care philosophy blends evidence-based rehabilitation with compassionate support.'
  });
});


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
