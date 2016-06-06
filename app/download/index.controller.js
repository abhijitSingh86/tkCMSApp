var express = require('express');    //Express Web Server 
var router = express.Router();


 console.log("here download");
  router.get('/download', function (req, res, next) {
  var file = './app/upload/img/test.pdf';
  console.log("here");
  res.download(file); // Set disposition and send it.
});  
//router.get('/app/download/download?', function (req, res){
 // var file = '../upload/img/test.pdf' ;
 // res.download(file); // Set disposition and send it.

//});

module.exports = router;