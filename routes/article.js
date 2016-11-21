
var express = require('express');
var auth=require('../middle/autoauth');
var router = express.Router();
var utils=require("../utils");
var models=require("../db/models");


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('文章页面');
});

router.get('/add',auth.checkLogin, function(req, res, next) {
    res.render('article/add',{title:'发表文章'});
});
router.post('/add', auth.checkLogin, function(req, res, next) {
    var article=req.body;
    console.log(article);
    models.Article.create({title:article.title,
                            content:article.content,
                            user:req.session.user._id},function (err, art) {
        if(err)
        {
            req.flash('error','发布失败，请重新再试');
            res.redirect('/article/add');
        }else
        {
            console.log(art);
            req.flash('success','发布成功');
            res.redirect('/');
        }
    })
});

//详情页
router.get('/detail/:_id', function(req, res) {
    models.Article.findOne({_id:req.params._id},function (err, article) {
        // console.log(article);
        res.render('article/detail',{title:'查看文章',article:article});
    })

});



module.exports = router;