var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
var isMongoConnected = false;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectRouter = require("./routes/project");
var oauthRouter = require("./routes/oauth");
var authRouter = require("./routes/auth");
var appapiRouter = require("./routes/applist");
const { exit } = require("process");

var app = express();
const PORT = process.env.PORT || 3001;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Expose-Headers", "x-auth");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,content-type, Accept , x-auth"
  );

  next();
});

// Edit Router Overall Here
app.use("/api/users", usersRouter);
app.use("/api/project", projectRouter);
app.use("/api/auth", authRouter);
app.use("/api/oauth", oauthRouter);
app.use("/api/app", appapiRouter);
app.use("/api", indexRouter);

//Compile JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

require("dotenv").config({ path: "./.env" });

console.log("Connecting MongoDB");
connect_mongo()
  .then(() => {
    isMongoConnected = true;
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server is loading on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Cannot connect to MongoDB, the details are as follows...");
    console.log(err);
    exit();
  });

async function connect_mongo() {
  await mongoose.connect(
    "mongodb+srv://sleeplessless:ysU4MhmG5guBJKk2@cluster0.0xr23ro.mongodb.net/somchart?retryWrites=true&w=majority"
  );

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

module.exports = app;
