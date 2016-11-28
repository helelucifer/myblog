
var express = require('express');
var auth=require('../middle/autoauth');
var router = express.Router();
var utils=require("../utils");
var models=require("../db/models");
var markdown = require('markdown').markdown;
var async = require('async');
/* GET users listing. */



router.get('/', function(req, res, next) {
    res.send('文章页面');
});

router.get('/add',auth.checkLogin, function(req, res, next) {
    res.render('article/edit',{title:'发表文章'});
});
//编辑和发布文章
router.post('/add', auth.checkLogin, function(req, res, next) {
    var article=req.body;
    var _id = req.body._id;
    if(_id){
        var set = {title:req.body.title,content:req.body.content};
        models.Article.update({_id:_id},{$set:set},function(err,result){
            if(err){
                req.flash('error','出了点小问题，请重试');
                return res.redirect('back');
            }
                req.flash('success', '更新文章成功!');
                res.redirect('/article/list/1/5');


        });
    }else{
        req.body.user = req.session.user._id;
    models.Article.create({title:article.title,
                            content:article.content,
                            user:req.session.user._id},function (err, art) {
        if(err)
        {
            req.flash('error','发布失败，请重新再试');
            res.redirect('/article/add');
        }
            req.flash('success','发布成功');
            res.redirect('/article/list/1/5');

    });
    }
});
//显示评论和阅读数量
router.get('/detail/:_id', function (req, res) {
    async.parallel([function(callback){
        models.Article.findOne({_id:req.params._id}).populate('user').populate('comments.user').exec(function(err,article){
            article.content = markdown.toHTML(article.content);
            callback(err,article);
        });
    },function(callback){
        models.Article.update({_id:req.params._id},{$inc:{pv:1}},callback);
    }],function(err,result){
        if(err){
            req.flash('error','出了点小异常，请重试');
            res.redirect('back');
        }
        res.render('article/detail',{title:'查看文章',article:result[0]});
    });
});
// 详情页
// router.get('/detail/:_id', function(req, res) {
//
//     models.Article.findOne({_id:req.params._id}).populate('user').exec(function (err, article) {
//         // console.log(article);
//         article.content = markdown.toHTML(article.content);
//         res.render('article/detail',{title:'查看文章',article:article});
//     })
// });

//删除
router.get('/delete/:_id', function (req, res) {
    models.Article.remove({_id:req.params._id},function(err,art){
        if(err){
            req.flash('error','删除失败请重试');
            res.redirect('back');
        }else{
            req.flash('success', '文章删除成功!');
            res.redirect('/article/list/1/5');
        }

    });
});

router.get('/edit/:_id', function (req, res) {
    models.Article.findOne({_id:req.params._id},function(err,article){
        res.render('article/add',{title:'编辑文章',article:article});
    });
});

//评论
router.post('/comment',auth.checkLogin, function (req, res) {
    var user = req.session.user;
    models.Article.update({_id:req.body._id},{$push:{comments:{user:user._id,content:req.body.content}}},function(err,result){
        if(err){
            req.flash('error','评论失败，请重试');
            return res.redirect('back');
        }
        req.flash('success', '评论成功!');
        res.redirect('back');
    });

});

router.all('/list/:pageNum/:pageSize',function (req, res, next) {
    var searchBtn=req.query.searchBtn;
    var pageNum =  req.params.pageNum && req.params.pageNum>0?parseInt(req.params.pageNum) : 1;
    var pageSize = req.params.pageSize && req.params.pageSize>0?parseInt(req.params.pageSize) : 5;
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

    models.Article.count(query,function(err,count){
        //查询符合当前页的数据
        models.Article.find(query)
            .sort({createTime:-1})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .populate('user')
            .exec(function (err, article) {
                article.forEach(function (article) {
                    article.content = markdown.toHTML(article.content);
                });
                //将数据渲染到首页
                res.render('index.html',{
                    title:'主页',
                    keyword:req.session.keyword,
                    article:article,  //保存了页面要显示的数据
                    count:count,    //查询出的数据一共有多少条
                    pageNum:pageNum,  //当前是第几页
                    pageSize:pageSize  //一共有多少页
                })
            })
    })

})
module.exports = router;