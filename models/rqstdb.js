var mongoose = require('mongoose');
var postFind = require('mongoose-post-find');
var async = require('async');
var Schema = mongoose.Schema;
var SamSchema=new Schema(
{  
    NAME: {                  
        type: String,
        required: true,
        unique: true
    },
    POS: {
            type:String,
            default:"xRequest"
        },
    handle:{
        type:Number,
        default: 0
            }
});


module.exports = mongoose.model('Rqstdb', SamSchema);

