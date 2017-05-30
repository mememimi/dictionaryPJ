var mongoose = require('mongoose');
var postFind = require('mongoose-post-find');
var async = require('async');
var Schema = mongoose.Schema;

var Schema = new Schema({  
    app_token: {           //데이터 건드릴때(조회,수정등..)마다 입력될데이터       
        type: String,
            default:null
    },
    usr_token: {
            type:String,
            default:null
        },
    conntime:{
            type:Date,
            default:Date.now,
            required: true//데이터가 생성되는 시간
        },
    word:{
        type:String //데이터의 단어값
    },
    pos:{type:String},//품사
    state:{
      type:Number,
      default:0 //추가시1 수정시2 신고시3 없는단어요청4
    },
    past:{
      type:String//단어뜻 수정시 예전값
    },
    now:{
      type:String//단어뜻 수정시 새로바꾼값
    },
    wb_idx:{type:Number},//문제집 인덱스
    qt_idx:{type:Number} //문제 idx값 
    ,
    sword:{
        type:String //출처때문에 검색할때의 단어
    }
})

module.exports = mongoose.model('Usrlog', Schema);
