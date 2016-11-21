
var express = require('express');
var auth=require('../middle/autoauth');
var router = express.Router();
var utils=require("../utils");
var models=require("../db/models");
var markdown = require('markdown').markdown;
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
    models.Article.findOne({_id:req.params._id}).populate('user').exec(function (err, article) {
        // console.log(article);
        article.content = markdown.toHTML(article.content);
        res.render('article/detail',{title:'查看文章',article:article});
    })
});

router.all('/list/:pageNum/:pageSize',function (req, res, next) {
    var searchBtn=req.query.searchBtn;
    var pageNum =  req.params.pageNum && req.params.pageNum>0?parseInt(req.params.pageNum) : 1;
    var pageSize = req.params.pageSize && req.params.pageSize>0?parseInt(req.params.pageSize) : 2;
    var query={};
    var keyword=req.query.keyword;

    //如果点击的是搜索按钮就会有搜索关键字
    if(searchBtn){
        req.session.keyword = keyword;
    }
    if(req.session.keyword){
        //设置查询条件
        query['title'] = new RegExp(req.session.keyword,"i");
    }

    // if(req.body.keyword)
    // {
    //
    //     query['title']=new RegExp(keyword,'ig');
    // }
    models.Article.count(query,function(err,count){
        //查询符合当前页的数据
        models.Article.find(query)
            .sort({createTime:-1})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .populate('user')
            .exec(function (err, article) {
                //将数据渲染到首页
                res.render('index.html',{
                    title:'主页',
                    article:article,  //保存了页面要显示的数据
                    count:count,    //查询出的数据一共有多少条
                    pageNum:pageNum,  //当前是第几页
                    pageSize:pageSize  //一共有多少页
                })
            })
    })


})
module.exports = router;