const u = require('./Utils');
const os = require("os");
const fs = require('fs');

module.exports = function(io, sketchManager) {
    // let broadcaster
    io.sockets.on("connection", socket => {
        socket.on('sketch.join', function (data) {

            socket.join(data.sketchCode);
            console.log(`joined the sketch ${data.sketchCode}`);
            socket.sketchCode = data.sketchCode

            socket.sketch = sketchManager.getSketch(socket.sketchCode);
        });

        socket.on('sketch.leave', function (data) {
            socket.leave(socket.sketchCode);
            console.log(`left the sketch ${socket.sketchCode}`);
            socket.sketchCode = undefined
        });

        socket.on('sketch.close', function() {
            io.sockets.to(socket.sketchCode).emit('sketch.close');
            try {
                socket.sketch.close();
                socket.leave(socket.sketchCode);
                sketchManager.delete(socket.sketchCode);
                console.log(`sketch ${socket.sketchCode} ended`);
                socket.sketch = undefined
            } catch(e) {
                console.log('unable to delete sketch');
            }
        });

        socket.on('image.uploading', function(data) {
            socket.broadcast.to(socket.sketchCode).emit('image.uploading', data);
        });

        socket.on('image.changed', function(data) {
            socket.broadcast.to(socket.sketchCode).emit('image.changed', data);
        });

        socket.on('image.delete', function(data) {
            socket.sketch.deleteImg(data.uuid);
            socket.broadcast.to(socket.sketchCode).emit('image.delete', data);
        });
        socket.on('image.create', function() {
            io.in(socket.sketchCode).emit('image.create', socket.sketch.createImg());
        });

        socket.on('disposition.change', function(data) {
            socket.sketch.setDisposition(data.globalDisposition);
            socket.broadcast.to(socket.sketchCode).emit('disposition.changed', data);
        })

        socket.on('disposition.switchTo', function(data) {
            socket.sketch.setMode(data.mode);
            socket.broadcast.to(socket.sketchCode).emit('disposition.switchTo', data);
        })

        socket.on('disposition.translateCarousel', function(data) {
            socket.broadcast.to(socket.sketchCode).emit('disposition.translateCarousel', data);
        })

        socket.on('disposition.setActive', function(data) {
            // console.log(data);
            socket.sketch.setActive(data.uuid);
            socket.broadcast.to(socket.sketchCode).emit('disposition.setActive', data);
        })
    });
}



