const path = require('path')
const fs = require('fs');
const multer = require('multer');

module.exports = {
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null,  path.join(__dirname, '../../public/sketchs'));
        },
    
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {
            cb(null, file.fieldname + path.extname(file.originalname));
        }
    }),
    imageFilter: function(req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    escape: function(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    },
    mkdir: function(dir) {
        try {
            // first check if directory already exists
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                console.log("Directory is created.");
            } else {
                console.log("Directory already exists.");
            }
        } catch (err) {
            console.log(err);
        }
    },

    dataURItoBlob: function (dataURI) {
        var byteStr;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteStr = atob(dataURI.split(',')[1]);
        else
            byteStr = unescape(dataURI.split(',')[1]);
    
        var mimeStr = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        var arr= new Uint8Array(byteStr.length);
        for (var i = 0; i < byteStr.length; i++) {
            arr[i] = byteStr.charCodeAt(i);
        }
    
        return new Blob([arr], {type:mimeStr});
    }
}