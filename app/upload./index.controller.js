var express = require('express');    //Express Web Server 
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var router = express.Router();

var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
          console.log("upload here");
//app.route('upload')
    router.post('/app/upload',function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        console.log("here");
        req.busboy.on('file', function (fieldname, file, filename) {
            filename= 'test.pdf';
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('back');           //where to go next
            });
        });
    });

 
    
module.exports = router;