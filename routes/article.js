/**
 * Created by 黎阳 on 2016/11/16.
 */
var express = require('express');
var auth=require('../middle/autoauth');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('文章页面');
});

router.get('/add',auth.checkLogin, function(req, res, next) {
    res.render('article/add',{title:'发表文章'});
});
router.post('/add', function(req, res, next) {
});
router.get('/view',auth.checkLogin, function(req, res, next) {
    res.send('查看文章');
});

module.exports = router;