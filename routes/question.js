var express = require('express');
var router = express.Router();
var questionDao = require('../models/users')
var  query = require('../models/mysql');
var count = 10;
//简单封装JSON方法
var jsonResponse = function (res,ret) {
    if(typeof ret ==='undefined'){
        res.json({
            code:'1',
            msg:'failed'

        });
    }else {
        res.json(ret);
    }

};

/* GET users listing. */
router.get('/', function(req, res, next) {
    var sql = "select * from question limit 0,"+count;
    query(sql,function (err,vals,fields) {
        jsonResponse(res,vals);
        count+=10;
    })
    // res.send('respond with a resource');
});
router.post('/queryByTitle',function (req,res,next) {
   questionDao.queryQuestion(req,res);
});
router.post('/post',function (req,res,next) {
    questionDao.postQuestion(req,res);
});
router.post('/queryById',function (req,res,next) {
    questionDao.getAnswerListByUid(req,res);
});
router.post('like',function (req,res,next) {
    questionDao.likeQuestion(req,res);
});
module.exports = router;
