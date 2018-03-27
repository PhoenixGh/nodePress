var  query = require('./mysql');
var crypto = require('crypto');
var key = 'scu';
var $util = require('./util')
var $sqlMapping = {
    queryById:'select * from users where uid = ',
    queryAnswer:'INSERT INTO answer (Answer_ID,Question_ID,uid, Name, Content) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE Answer_ID = ?,Question_ID = ?,uid = ?, Name = ?,Content = ?'
};
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            msg: '操作失败',
            success:false
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    //查找用户
    queryByStuID:function (req,res) {
        var sql = 'select * from users where student_id = "'+req.body.student_id+'"';
        console.log(req.body.student_id);
        query(sql,function(err,vals,fields){
        if(vals[0] == null) {
            res.json([{'password':'uhm7ygm6th7'}]);
        }else {
            console.log(vals);
            jsonWrite(res,vals);
        }
    });

    },

      findUser: function (req,res) {
         console.log(req.body);
          var  sql =$sqlMapping.queryById+req.body.uid;
          console.log(sql);
          query(sql,function (err,vals,fields) {
              jsonWrite(res,vals);
              console.log(vals);
          })
      },
      //插入用户
      InsertUser:function (req,res) {
          var bodys = req.body;
          console.log(bodys);
          var data = {
              userName : req.body[0].name,
              student_id: req.body[0].student_id,
              password : req.body[0].password
          };
          var message = '';
          if(data.userName == null){
              message = '用户名为空';
          }
          if(data.password.length<6){
              message = '密码小于6位';
          }
          if(message!==''){
              res.json({
                  'msg':message,
                  'success':false
              });
              return false;
          }
          var hash = crypto.createHmac('sha256',key).update(data.password+data.userName).digest('hex');
          console.log(hash);
          var sql = 'insert into users(name,hash,student_id,password)  values("'+data.userName+'","'+hash +'",'+data.student_id+',"'+data.password+'");';
          console.log(sql);
          query (sql,function (err,vals,fields) {
              if(err){
                  res.send('学号已存在！');
              }
          });
          query ('select uid from users where hash = "'+hash+'"',function (err,vals,fields) {
              var uid = vals;
              if(uid == null){
                  console.log('uid query failed');
              }else {
                  res.json({
                      'msg':'创建成功',
                      "success":true,
                      'uid':vals
                  })
              }
          });

      },

    authUser:function (req,res) {
        var data = {
            userName:req.body.name,
            password:req.body.password
        };
        var sql = 'select password ,uid from user where name = "'+data.userName+'" ';
        query(sql,function (err,vals,fields) {
            if(vals.length == 0){
                res.send({
                    'message':'用户不存在',
                    'success':false
                });
            }else {
                if (vals[0].password!=data.password){
                    res.send({
                        "message": "密码错误",
                        "success": false
                    });
                } else {
                    res.send({
                        'uid':vals[0].uid
                    })

                }
            }
        })
      },
    updateUser:function (req,res) {
          if (req.body == null){
              jsonWrite(res,undefined);
              return;
          }
          var reqbody = req.body[0];
    var data = {
              uid:reqbody.uid,
        username:reqbody.name,
        password:reqbody.password,
        sex:reqbody.sex,
        description:reqbody.description,
        signature:reqbody.signature,
        location:reqbody.location,
        habit:reqbody.habit,
        educationextra:reqbody.educationextra
    };
    var sql = 'update users SET description ="'+data.description+'",signature="'+data.signature+'",name = "'+data.username+'",habit = "'+data.habit+ '"where uid = '+data.uid;
    console.log(sql);
      query(sql,function (err,vals,fields) {
              res.json({
                  'msg': '更新成功',
                  "success": true
              });
      })
    },

    logoutUser:function (req,res) {

    },
    queryQuestion:function (req,res) {
        var data= {
            Question_ID:req.body[0].Question_ID,
            title:req.body[0].title
        };
        if(data.Question_ID == null && data.title != null){
            var sql ='select * from question where title like "'+data.title+'"';
            query(sql,function (err,vals,fields) {
                jsonWrite(res,vals);
            });
        }
    },
    postQuestion:function (req,res) {
        var body = req.body[0];
        var title = body.title;
        var Content = body.Content;
        var uid = body.uid;
        var name = body.name;
        var sql = 'Insert into question (title ,Content ,uid,name) values ("'+title+'","'+Content+'",'+uid+',"'+name+'")';
        console.log(sql);
        query(sql,function (err,vals,fields) {
            res.send({
                'message':"创建问题成功",
                'success':true
            })
        });
    },
    //点开问题返回问题细节和答案
    getQuestionDetail:function (req,res) {

    },
    getAnswerListByUid:function (req,res) {
        var uid =req.body.uid;
        var sql = 'select * from question where uid = '+uid;
        query(sql,function (err,vals,fields) {
            jsonWrite(res,vals);
        })
    },
    likeQuestion:function (req,res) {
          var id = req.body.Question_ID;
          var likes;
        query('select like from question where Question_ID = '+id,function (err,vals,fields) {
            likes = vals.like+1;
            query('Insert into question (like) values('+likes+')',function (err,vals,fields) {
                res.send({
                    'message':"赞",
                    'success':true
                })
            })
        })
    },
    queryAnswer:function (req,res) {
        var data = req.body;
        console.log(data);
        var sql = 'select * from answer where Question_ID like "' + data.Question_ID+'"';
        query(sql, function (err, vals, fields) {
            jsonWrite(res, vals);
        });
    },

    postAnswer:function (req,res) {
        var  answerData = req.body[0];

        console.log(answerData);
    var sql = 'INSERT INTO answer (Answer_ID,Question_ID,uid, Name, Content) VALUES ('+answerData.Answer_ID+','+answerData.Question_ID+','+answerData.uid+',"'+answerData.Name+'","'+answerData.Content+'") ON DUPLICATE KEY UPDATE Answer_ID = '+answerData.Answer_ID+',Question_ID ='+ answerData.Question_ID+',uid ='+ answerData.uid+', Name ="'+ answerData.Name+'",Content ="'+answerData.Content+'"';
    //};,(answerData.Answer_ID,answerData.Question_ID,answerData.uid,answerData.Name,answerData.Content,answerData.Answer_ID,answerData.Question_ID,answerData.uid,answerData.Name,answerData.Content));
    console.log(sql);
    query(sql,function (err,vals,fields) {
        if(err){
            res.json({
                'msg': '更新失败',
                "success": false,
                'err':err
            });
        }else {
            res.json({
                'msg': '更新成功',
                "success": true
            });
        }
    })
    },
    likeAnswer:function (req,res) {

    }

};