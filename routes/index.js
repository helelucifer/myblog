var express = require('express');
//加载express的路由模块
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{title:'黎阳的博客'});
});

module.exports = router;
