var express = require('express');
var mongoose=require('mongoose');
var Dicdb = mongoose.model('Dicdb');
var Rqstdb = mongoose.model('Rqstdb');
var Usrlog = mongoose.model('Usrlog');

var router=express.Router();
var Lemmer = require('lemmer');


router.get('/all',function(req,res,next){//10개만띄워주는라우트   
    Dicdb.find({},{NAME:1,POS:1,MEAN:1,sentences:1,src:1}).limit(10).exec(function (error, results) {
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  }); 
        });

router.get('/imss/:som',function(req,res,next){ //이게진짜 수정 전 콘솔검색용라우트
	        var ci=req.params.som;
  //         var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi;
   //     ci= ci.replace(regExp, "");   콘솔에서는 특수문자 제거하지않는다
          var gap=ci+" ";
       Lemmer.lemmatize([ci], function(err, word){   //검색할 문장을 [] 배열속에 넣어줘야 적용된다
             Dicdb.find({$or:[{NAME:ci},{NAME:word},{NAME:gap}]},{NAME:1,POS:1,MEAN:1,sentences:1,src:1})
             .exec(function (error, results) {
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  });
           });

       var zz=new Usrlog();
            zz.word=ci;
             zz.save(function(err){
              if(err){console.error(err);
                return;}
                console.log("Saved Usr record");
                 
            });
      });

      router.get('/search/:som',function(req,res,next){ //지금은 테스트중:콘솔검색용라우트
	        var ci=req.params.som;
          //ci="/"+ci+"/i;
  //         var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi;
   //     ci= ci.replace(regExp, "");   콘솔에서는 특수문자 제거하지않는다
        ci=ci.toLowerCase();//아랫줄 적용 전 임시용..
          var gap=ci+" ";
          // {$or:[{NAME:{$regex : "^"+ci+"$", $options : "i"}},{NAME:word}]},
       Lemmer.lemmatize([ci], function(err, word){   //검색할 문장을 [] 배열속에 넣어줘야 적용된다
             Dicdb.find({$or:[{NAME:ci},{NAME:word},{NAME:gap}]},{NAME:1,POS:1,MEAN:1,sentences:1,src:1})
             .exec(function (error, results) {
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  });
           });
      });

router.get('/app/search/:tos',function(req,res,next){//앱에서 검색할때쓸 라우트
        var mm=req.params.tos;
         var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\_<>@\#$%&\\\=\(\'\"]/gi;
        mm= mm.replace(regExp, "");
        mm= mm.replace('+', " ");
                  var gap=mm+" ";
       Lemmer.lemmatize([mm], function(err, word){   //검색할 문장을 [] 배열속에 넣어줘야 적용된다
    Dicdb.find({$or: [{NAME:word},{NAME:mm},{NAME:gap}]},{ NAME:1,POS:1,MEAN:1,src:1,sentences:1
  }).limit(5).exec(function (error, results) { //10개다뜰경우 감당못해종료되니 숫자줄였다!!
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  });
       });

     var kon=new Usrlog();  //검색할때마다 로그 남도록
            kon.word=mm;
            var ju=req.query.usr_token;
            var coo=req.query.app_token;
            if(ju==undefined){}
            else{kon.usr_token=ju;}
            if(coo==undefined){}
            else{kon.app_token=coo} 

            kon.save(function(err){
              if(err){console.error(err);
                return;}
                console.log("Saved Usr record");
                 
            });
        });

router.put('/test/save/:un/:up/:um', function (req, res,next) {//새 단어 추가
   var td=req.params.un;
   var ti=req.params.up;
   var tt=req.params.um;
        
         Dicdb.update({NAME:td,POS:ti},{ $set: {NAME:td,claim:0,sentences:[],POS:ti,MEAN:tt,src:[{name:"기본db 2"}]}},
         { upsert: true} )
         //$set이있어야 특정필드만바꿀수있다 없으면 통째로 내용이바뀌어버림 ㅠㅠ
         .exec(function (error) { //updateOne으로하면 안됨
           if (error) {
            return next(error);
              }
           console.log("Upserted data to mlab!!");
         });
         
            var sot=new Usrlog();
            sot.word=td; 
            sot.state=1;
            sot.pos=ti;
            sot.save(function(err){
              if(err){console.error(err);
                return;}
                console.log("Saved Usr record");  
            });


        });

router.get('/update/:nid',function(req,res,next){//수정할때 그데이터로접속위해 id값받아오는라우트
        var idv=req.params.nid;
         
         Dicdb.findOne({_id:idv}).exec(function (error, results) {
           if (error) {
            return next(error);
              }
              if (!results) {
            res.send(404);
               }
           res.end(JSON.stringify(results));
         }); 
            
        });

router.post('/update/:iid/:bn/:bp/:bm',function(req,res,next){//수정
        var sid=req.params.iid;
        var sn=req.params.bn;
        var sp=req.params.bp;
        var sm=req.params.bm;

        Dicdb.findOne({_id:sid}).exec(function (error, results) {
         // console.log(results);
           if (error) {
            return next(error);
              }
              if (!results) {
          //console.log(results);                
            res.send(404);
               }
           var past=results;
           var ki=past.MEAN;//"따옴표안에"든 형태로출력된다 
           //res.end(JSON.stringify(ki));
           //이때출력값은 밑에서 업데이트하기 이전의값임
         }); 
        //console.log(past.NAME);콘솔에출력시키면에러!!
         
         Dicdb.update({_id:sid},{ $set: { NAME: sn,POS:sp,MEAN:sm } })
         //$set이있어야 특정필드만바꿀수있다 없으면 통째로 내용이바뀌어버림 ㅠㅠ
         .exec(function (error) { //updateOne으로하면 안됨
           if (error) {
            return next(error);
              }
           console.log("Updated data to mlab!!");
         });      

         var cod=new Usrlog();
            cod.word=sn; 
            cod.state=2;
            cod.past=ki;
            cod.pos=sp;
            cod.now=sm; //뜻만 전후내용 저장하는거맞나??
            cod.save(function(err){
              if(err){console.error(err);
                return;}
                console.log("Saved Usr record");  
            });

       });

router.post('/nodata/:bn',function(req,res,next){//없는단어 표시하기
        var sn=req.params.bn;
         var at=new Rqstdb();
            at.NAME=sn;
            at.save(function(err){
              if(err){console.log("already has data");
                return;}
                console.log("Singed complete!");
                 });

            var nu=new Usrlog();
            nu.word=sn; 
            nu.state=4;
            var ju=req.query.usr_token;
            var coo=req.query.app_token;
            if(ju==undefined){}
            else{nu.usr_token=ju;}
            if(coo==undefined){}
            else{nu.app_token=coo}
            nu.save(function(err){
              if(err){console.error(err);
                return;}
                console.log("Saved Usr record");  
            }); 

       });

       router.get('/listnow',function(req,res,next){//현재보유데이터 40개만띄워줌   
    Dicdb.find({},{NAME:1,POS:1,MEAN:1,sentences:1}).limit(40).exec(function (error, results) {
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  }); 
        });

       router.get('/check',function(req,res,next){//요청단어 20개만띄워줌   
    Rqstdb.find({handle:0},{NAME:1,POS:1}).limit(20).exec(function (error, results) {
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  }); 
        });
        router.get('/check/:dd',function(req,res,next){
          var sm=req.params.dd;   
    Rqstdb.find({NAME:sm},{NAME:1,POS:1}).limit(10).exec(function (error, results) {
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  }); 
        });

router.post('/upsen/:bm/:tt/:sam',function(req,res,next){ //단어와품사로 예문만추가하는라우트
        var sm=req.params.bm;
        var so=req.params.tt;
        var ex=req.params.sam;
        //updateOne으로하면 안됨
         Dicdb.update({NAME:sm,POS:so},{$push:{sentences:{eng:ex},src:{name:""}}})
         .exec(function (error) { 
           if (error) {
            return next(error);
              }
           console.log("Updated data to mlab!!");
         }); 

         var im=new Usrlog();
            im.word=sm; 
            im.state=2;
            im.pos=so;
            var ju=req.query.usr_token;
            var coo=req.query.app_token;
            if(ju==undefined){}
            else{im.usr_token=ju;}
            if(coo==undefined){}
            else{im.app_token=coo}
            im.save(function(err){
              if(err){console.error(err);
                return;}
                console.log("Saved Usr record");  
            });

       });

router.post('/usrclaim/:bm/:tt',function(req,res,next){ //신고들어올경우 신고횟수추가라우트
        var hh=req.params.bm;
        var hk=req.params.tt;
        //updateOne으로하면 안됨
         Dicdb.update({NAME:hh,POS:hk},{$inc: { claim: 1}})//간혹 저장된 db상에 해당 필드가 없을 수 있는데
                                              //여기서 사용하는 Dicdb구조에만 필드가 있다면 사용하는데 지장없다.
         .exec(function (error) { 
           if (error) {
            return next(error);
              }
           console.log("Updated data to mlab!!");
         }); 
         var nu=new Usrlog();
            nu.word=hh; 
            nu.state=3;
            nu.pos=hk;
            var ju=req.query.usr_token;
            var coo=req.query.app_token;
            if(ju==undefined){}
            else{nu.usr_token=ju;}
            if(coo==undefined){}
            else{nu.app_token=coo}
            nu.save(function(err){
              if(err){console.error(err);
                return;}
                console.log("Saved Usr record");  
            });       
       });

router.post('/applyrqst/:bm', function(req, res, next) {
        var hh=req.params.bm;
         Rqstdb.update({NAME:hh},{ $set: {handle:1}})
         //$set이있어야 특정필드만바꿀수있다 없으면 통째로 내용이바뀌어버림 ㅠㅠ
         .exec(function (error) { //updateOne으로하면 안됨
           if (error) {
            return next(error);
              }
           console.log("handled rqst word!");
         });

});

router.get('/otherapp/word/:tos',function(req,res,next){//다른앱에서 검색할때의 라우트
        var mm=req.params.tos;
         var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\_<>@\#$%&\\\=\(\'\"]/gi;
        mm= mm.replace(regExp, "");
        mm= mm.replace('+', " ");
        mm=mm.toLowerCase();
          var gap=mm+" ";
       Lemmer.lemmatize([mm], function(err, word){   //검색할 문장을 [] 배열속에 넣어줘야 적용된다
    Dicdb.find({$or: [{NAME:word},{NAME:mm},{NAME:gap}]},{ NAME:1,POS:1,MEAN:1,src:1,sentences:1
  }).limit(5).exec(function (error, words) { //10개다뜰경우 감당못해종료되니 숫>자줄였다!!
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify({

    "extra":{
        "state":true,
        "code":100,
        "msg":"정상적으로 조회되었습니다.",
        "data":{
               words
               }
        }
                         }));
                 });
    });

     var kon=new Usrlog();
            kon.word=mm;
            var ju=req.query.usr_token;
            var coo=req.query.app_token;
            var wbidx=req.query.wb_idx;
            var qidx=req.query.qt_idx;
            if(ju==undefined){}
            else{kon.usr_token=ju;}
            if(coo==undefined){}
            else{kon.app_token=coo}
            if(wbidx==undefined){}
            else{kon.wb_idx=wbidx}
            if(qidx==undefined){}
            else{kon.qt_idx=qidx}

            kon.save(function(err){
              if(err){console.error(err);
                return;}
            });
        });

router.get('/lockscreen/:tos',function(req,res,next){//어플 잠금화면에서 출처정보얻는 라우트 
        var mm=req.params.tos;//추후 우리단어장의 모든단어가 들어가있는게 완전히 검증되면 lemmer안거치고 바로 띄우도록 처리해야함

        mm= mm.replace('+', " ");
       Lemmer.lemmatize([mm], function(err, word){   //검색할 문장을 [] 배열속에 넣어줘야 적용된다
    Dicdb.find({$or: [{NAME:word},{NAME:mm}]},{ NAME:1,POS:1,MEAN:1,src:1,sentences:1
  }).limit(5).exec(function (error, results) { 
    if (error) {
      return next(error);
    }
   res.end(JSON.stringify(results));
  });
       });

     var kon=new Usrlog();
            kon.sword=mm;
            var ju=req.query.usr_token;
            var coo=req.query.app_token;
            if(ju==undefined){}
            else{kon.usr_token=ju;}
            if(coo==undefined){}
            else{kon.app_token=coo} 

            kon.save(function(err){
              if(err){console.error(err);
                return;}
                
            });
        });

router.get('/dglig',function(req,res,next){ //테스트라우트
       
     Dicdb.aggregate([ 
        {$group: {
                _id: "$POS",  //기준으로 할 키값 
                count: {$sum: 1},//해당 키가 몇개나있나 카운트 
            }
        },{$sort:{"count":-1}}//count 많은기준으로 sort
    ]).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    
  res.end(JSON.stringify(results));
  });
});
router.get('/cocotst',function(req,res,next){ //테스트라우트
       
     Usrlog.aggregate([ //find({qt_idx:true}). 정도 추가하면 될듯
        {$group: {
                _id: "$wb_idx",  //기준으로 할 키값 
                count: {$sum: 1},//해당 키가 몇개나있나 카운트 
            }//테스트하느라 넣었던 wb_idx랑 qt_idx5개쯤있는거나중에삭제
        },{$sort:{"count":-1}}//count 많은기준으로 sort
    ]).limit(10)
             .exec(function (error, results) {
    if (error) {
      return next(error);
    }
    
  res.end(JSON.stringify(results));
  });
});


module.exports = router;
