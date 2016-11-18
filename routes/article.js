/**
 * Created by 黎阳 on 2016/11/16.
 */
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
router.get('/view',auth.checkLogin, function(req, res, next) {
    res.send('查看文章');
});

module.exports = router;