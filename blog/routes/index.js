var express = require('express');
var router = express.Router();


//mongo服务
var mongodb=require('mongodb').MongoClient;
//数据库地址
var db_str='mongodb://localhost:27017/blog'



/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index', {user:req.session.user});
});

//点击注册
router.all('/regist',function(req,res,next){
	res.render('regist',{})
})

//点击登录
router.all('/login',function(req,res,next){
	res.render('login',{})
})

// 销毁session
router.get('/exist',function(req,res,next){
	    
 	 req.session.destroy(function(err){		
			if(err){			
				console.log(err)		
			}else{			
				res.redirect("/")		
			}	
})

 })
 // 点击随笔
 router.all('/sui',function(req,res,next){
	res.render('sui',{})
})
 

router.get('/message',function(req,res,next){
	res.render('message',{shuju:""})
})

// 获取留言信息
router.post('/message',function(req,res,next){
	var user=req.session.user;
//	res.send(req.session.user);
	if(user){
		//留言数据插入到xinxi集合中
		//获取留言板表单数据
		var title=req.body['title']
		var con=req.body['con']
			console.log(title)
		//插入函数
		var insertdata=function(db,callback){
			//找到要插入的集合
			var coll3=db.collection('xinxi')
			//设置需要插入集合的文档数据
			var data=[{title:title,con:con}]
			coll3.insert(data,function(err,result){
				if(err){
					console.log(err)
				}else{
					callback(result)
				}
			})
		}
		//链接数据库 
		mongodb.connect(db_str,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功')
				//调用插入函数
				insertdata(db,function(result){
					console.log(result)
					res.redirect('/message/list')
					db.close()
				})
			}	
		})	
	}else{
		res.send("session过期")
	}
})
   //  显示留言数据
router.get('/message/list',function(req,res,next){
	
	 var finddata=function(db,callback){
	 	  var cole4=db.collection('xinxi')
	 	  cole4.find({}).toArray(function(err,result){
	 	  	  callback(result)
	 	  })
	 }
	 //连接数据库
	 mongodb.connect(db_str,function(err,db){
	 	  if(err){
	 	  	console.log(err)
	 	  }else{
	 	  	console.log('连接数据库成功')
	 	  	finddata(db,function(result){
	 	  		 res.render('message',{shuju:result})
	 	  		 
	 	  		 console.log(result)
	 	  	})
	 	  }
	 })
})

module.exports = router;
