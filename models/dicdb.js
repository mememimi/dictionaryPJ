var mongoose = require('mongoose');
var postFind = require('mongoose-post-find');
var async = require('async');
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
            default:"update's coming"
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


module.exports = mongoose.model('Dicdb', DicSchema);

