/**
 * Created by 黎阳 on 2016/11/16.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('文章页面');
});

router.get('/add', function(req, res, next) {
    res.render('article/add');
});

router.get('/read', function(req, res, next) {
    res.send('查看文章');
});

module.exports = router;