var mongoose = require('mongoose');
//var dbUrl = 'mongodb://me:1234@ds157621.mlab.com:57621/mlabdb'; 
//for use, activate upline.

mongoose.connect(dbUrl);

// 컨트롤 + C를 누르면 몽구스 연결 종료
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected');
    process.exit(0);
  });
});

require('../models/dicdb');
require('../models/rqstdb');
require('../models/usrlog');
