var express = require('express');
var markdown = require('markdown').markdown;
var models = require('../db/models');
//加载express的路由模块
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    models.Article.find({},{},{sort:{createTime:-1}}).populate('user').exec(function (err, article) {
        article.forEach(function (art) {
        //     //把markdown格式的文本转化成html输出
            art.content = markdown.toHTML(art.content);
        });
        res.render('index',{title:'黎阳的博客',article:article});
    });
});
router.get('/index', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;
