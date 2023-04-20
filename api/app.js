var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");

const mongoose = require("mongoose");
var isMongoConnected = false;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

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

// Edit Router Overall Here
app.use("/", indexRouter);
app.use("/users", usersRouter);

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

app.listen(PORT, () => {
  console.log(`Server is loading on port ${PORT}`);
  connect_mongo()
    .then(() => {
      isMongoConnected = true;
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log("Cannot connect to MongoDB, the details are as follows...");
      console.log(err);
    });
});

async function connect_mongo() {
  await mongoose.connect(
    "mongodb+srv://sleeplessless:ysU4MhmG5guBJKk2@cluster0.0xr23ro.mongodb.net/somchart?retryWrites=true&w=majority"
  );

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

module.exports = app;
