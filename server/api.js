var express = require('express');
var data = require('../data');
var router = express.Router();
var fs = require('fs');

router.get('/', function (req, res, next) {
  res.json(data);
});

router.post('/', function (req, res, next) {
  var newItem = req.body;

  var arr = [...data.list];
  arr.push(newItem);
  data.list = arr;
  fs.writeFile('./data.json', JSON.stringify(data), function (err) {
    if (err) throw err;
    res.send(JSON.stringify(data));
  });
});

module.exports = router;
