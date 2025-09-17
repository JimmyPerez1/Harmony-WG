require("dotenv").config();

const express = require("express");
const app = express();

app.set("view engine", "ejs");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.lang = req.cookies.lang === 'es' ? 'es' : 'en';
  next();
});

app.use("/request-appointment", require("./controllers/appointments"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(
  morgan("dev", {
    skip: (req, res) =>
      req.path.startsWith("/.well-known") || res.statusCode === 304,
  })
);

app.use((req, res, next) => {
  res.locals.user = null;
  next();
});



app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));
app.get("/services", (req, res) => res.render("services"));



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
