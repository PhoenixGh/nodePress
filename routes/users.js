var express = require('express');
var router = express.Router();
var userDao = require('../models/users')
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
    var sql = "select * from users;";
    query(sql,function (err,vals,fields) {
        jsonResponse(res,vals);
    })
 // res.send('respond with a resource');
});
router.post('/register',function (req,res,next) {
    userDao.InsertUser(req,res);
});
router.post('/login',function (req,res,next) {
    userDao.authUser(req,res);
});
router.post('/queryByStuId',function (req,res,next) {
    userDao.queryByStuID(req,res);
});
router.post('/queryById',function (req,res,next) {
    userDao.findUser(req,res);
});
router.post('/update',function (req,res,next) {
    userDao.updateUser(req,res);
});
module.exports = router;
