var express = require("express");
var router = express.Router();

//Edit your API here

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/hi", function (req, res, next) {
  res.send({ message: "Hello" });
});

module.exports = router;
