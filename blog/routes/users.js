var express = require('express');
var router = express.Router();



//mongo服务
var mongodb=require('mongodb').MongoClient;
//数据库地址
var db_str='mongodb://localhost:27017/blog'
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 注册的验证
 
 router.post('/form',function(req,res,next){
 	 var user=req.body['user']
 	 var pass=req.body['pass']
 	 var email=req.body['email']
 	
 	 var insertdata=function(db,callback){
 	 	   var cloe=db.collection('b')
 	 	   var data=[{user:user,pass:pass,email:email}]
 	 	   cloe.insert(data,function(err,result){
 	 	   	  if(err){
 	 	   	  	console.log(err)
 	 	   	  }else{
 	 	   	     callback(result)
 	 	   	  }
 	 	   })
 	 }
 	//连接数据库
 	mongodb.connect(db_str,function(err,db){
 		if(err){
 			console.log('链接数据库失败')
 		}else{
 			insertdata(db,function(result){
 				console.log(result)
 			})
 			//res.send('链接数据库成功')
 			res.redirect('/login')
 			db.close()
 		}
 	}) 	 
 })

// 登录
router.post('/form1',function(req,res,next){
		//查询函数
		var findData=function(db,callback){
			//找到要查询的集合
			var coll1=db.collection('b')
			//数据查询
			var data={user:req.body['user'],pass:req.body['pass']}
			
			coll1.find(data).toArray(function(err,result){
				callback(result)
			})
		}
		//链接数据库 
		mongodb.connect(db_str,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功11111')
				//调用查询函数
				findData(db,function(result){
					if(result.length>0){
						console.log(result)
//						res.send('登陆成功')
						//设置session／／index中获取传入到index。ejs中
						req.session.user=result[0].user
						res.redirect('/')
						//关闭数据库
						db.close()
					}else{
						res.send('账号密码错误')
					}			
				})
			}
		})
})





module.exports = router;
