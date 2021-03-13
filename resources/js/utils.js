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
    sendNoSignalStream: function(req, res) {
        const random = Math.floor(Math.random()*2);
        const videoPath = path.join(__dirname, `/../assets/no-signal-${random}.mp4`);
        const stat = fs.statSync(videoPath)
        const fileSize = stat.size
        const range = req.headers.range
      
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1
        
            if(start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
                return
            }
            
            const chunksize = (end-start)+1
        
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            })

            const file = fs.createReadStream(videoPath, {start, end})
            file.pipe(res)
        } else {
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            })
            fs.createReadStream(videoPath).pipe(res)
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