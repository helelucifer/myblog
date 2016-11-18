var express = require('express');
var models=require("../db/models");
var auth=require('../middle/autoauth');
var router = express.Router();
var utils=require("../utils");

/* GET users listing. */
router.get('/',auth.checkNotLogin, function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/reg',auth.checkNotLogin, function(req, res, next) {
    res.render('users/reg',{title:'用户注册'})
});
router.post('/reg', function(req, res, next) {
    //获取表单数据
    var user=req.body;
    if(user.pwd === user.pwd2){
        models.User.findOne({username:user.username},function (err, doc) {
            if(doc)
            {
                //如果有值，用户名已存在，注册失败
                req.flash('error',"用户名已存在!请重新注册");
                res.redirect('/users/reg');
            }else
            {
                //没有值才能够注册
                models.User.create(
                    //脱库攻击
                    {username:user.username,
                        password:utils.md5(''+user.pwd),
                        email:user.email,
                        avatar:'https://s.gravatar.com/avatar/'+utils.md5(user.email)+'?s=40'},
                    function (err, doc) {
                        if(err)
                        {
                            req.flash('error','注册失败!请重新再试');
                            res.redirect("/users/reg");
                        }else
                        {
                            //注册成功重定向到登录页面
                            req.flash('success','注册成功!请登录');
                            res.redirect("/users/login");
                        }
                    }
                );
            }
        })
    }else
    {
        //两次密码不一致
        req.flash('error','密码和确认密码不一致！');
        res.redirect('/users/reg');
    }

});
router.get('/login',auth.checkNotLogin, function(req, res, next) {
    res.render('users/login',{title:'用户登录'});
});

router.post('/login', function(req, res, next) {
    //获取表单数据
    var user=req.body;
    models.User.findOne({username:user.username,
    password:utils.md5(''+user.pwd)},function (err, doc) {
        if(doc)
        {
            //如果doc存在，则登录成功
            //登陆成功后，将用户的信息放入session保存
            req.session.user=doc;
            // 重定向是由服务端向客户端浏览器发出的状态是301/302的响应码
            //告诉浏览器要发出新的请求，地址是'/'也就是网站的根目录
            //转发  forward
            //放入成功的消息
            req.flash("success",'登录成功');
            res.redirect("/");
        }else{
            //如果doc不存在则登录失败
            //放入失败的消息
            req.flash("error",'登录失败,用户名或密码错误');
            res.redirect("./login");
        }
    });
});
router.get('/logout',auth.checkLogin, function(req, res, next) {
    req.session.user=null;
    res.redirect('/');
});
module.exports = router;
