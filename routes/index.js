var express = require('express');
var models = require('../db/models');
//加载express的路由模块
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {

    models.Article.find({}).populate('user').exec(function (err, article) {
        res.render('index',{title:'黎阳的博客',article:article});
    })
});

module.exports = router;
