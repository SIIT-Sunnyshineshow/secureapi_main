var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

//Mongo Model (Name,Schema,collection)
const testScheme = mongoose.model("test", { message: String }, "test");

//Edit your API here

/* GET home page. */

router.get("/hi", function (req, res, next) {
  res.send({ message: "Hello" });
});

router.post("/testdb", (req, res, next) => {
  let data = req.body;
  console.log(data);
  //console.log(req);
  let sendingData = new testScheme({ message: data.message });

  sendingData
    .save()
    .then((mongoRes) => {
      //console.log(res);
      res.send({ code: 200, message: data.message, dbres: mongoRes });
      console.log("Data send correctly");
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: 400, err: err });
    });
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
