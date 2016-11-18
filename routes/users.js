var express = require('express');
var models=require("../db/models");
var router = express.Router();
var utils=require("../utils");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/reg', function(req, res, next) {
    res.render('users/reg')
});
router.post('/reg', function(req, res, next) {
    //获取表单数据
    var user=req.body;
    if(user.pwd == user.pwd2){
        models.User.findOne({username:user.username},function (err, doc) {
            if(doc)
            {
                //如果有值，用户名已存在，注册失败
            }else
            {
                //没有值才能够注册
                models.User.create(
                    //脱库攻击
                    {username:user.username,
                        password:utils.md5(''+user.pwd),
                        email:user.email},function (err, doc) {
                        if(err)
                        {

                        }else
                        {
                            //注册成功重定向到登录页面
                            res.redirect("/users/login");
                        }
                    }
                );
            }
        })
    }else
    {
        //两次密码不一致
    }

});
router.get('/login', function(req, res, next) {
    res.render('users/login');
});

router.post('/login', function(req, res, next) {
    //获取表单数据
    var user=req.body;
    models.User.findOne({username:user.username,
    password:utils.md5(''+user.pwd)},function (err, doc) {
        if(doc)
        {
            //如果doc存在，则登录成功
            res.redirect("/");
        }else{
            //如果不存在则登录失败
            res.redirect("./login");
        }
    });
});
router.get('/logout', function(req, res, next) {
    res.render('users/logout');
});
module.exports = router;
