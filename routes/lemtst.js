var mongoose=require('mongoose');
var Lemmer = require('lemmer');
var postFind = require('mongoose-post-find');
var async = require('async');
var dbUrl = 'mongodb://me:1234@ds157621.mlab.com:57621/mlabdb';
var Schema = mongoose.Schema;
var DicSchema=new Schema(
{  
    NAME: {                  
        type: String,
        default:"추가요망",
        required: true
    },
    POS: {
            type:String,
            default:"xRequest"
        },
    MEAN:{
            type:String,
            default:"update's comming"
        },
    sentences:[{
        eng:{
            type:String,
            default:""
        },
        kor:{
            type:String,
            default:""
        }
    } ],
        
    src:[{
        name:{
            type:String,
            default:""
        },
        link:{
            type:String,
            default:""
        }
    }],
    claim:{
        type:Number,
        default:0
    }
});
var Dicdb=mongoose.model('Dicdb', DicSchema);
mongoose.connect(dbUrl);

var som='fought';
var co;
console.log(som);
    Lemmer.lemmatize(som, function(err, word){
  co=word;
  console.log(word); 
  });

//  co=co.toString();
console.log(co); 
//    var regExp = /[\[\]\'\s]/gi;
//       co=co.replace(regExp, "");

 Dicdb.find({NAME:co},{NAME:1,POS:1}).exec(function (error, results) {
           if (error) {
            return next(error);
              }
              if (!results) {
            res.send(404);
               }
           console.log(results);
         }); 