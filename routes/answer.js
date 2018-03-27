var express = require('express');
var router = express.Router();
var AnswerDao = require('../models/users')
var  query = require('../models/mysql');
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
    var sql = "select * from answer ";
    query(sql,function (err,vals,fields) {
        jsonResponse(res,vals);
    })
    // res.send('respond with a resource');
});
router.post('/queryById',function (req,res,next) {
    AnswerDao.queryAnswer(req,res);
})
router.post('/update',function (req,res,next) {
    AnswerDao.postAnswer(req,res);
});
module.exports = router;
