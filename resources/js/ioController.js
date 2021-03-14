const u = require('./utils');
const os = require("os");
const fs = require('fs');

module.exports = function(io, sketchManager) {
    // let broadcaster
    io.sockets.on("connection", socket => {
        socket.on('join', function (data) {

            socket.join(data.sketchCode);
            console.log(`joined the sketch ${data.sketchCode}`);
            socket.sketchCode = data.sketchCode

            socket.sketch = sketchManager.getSketch(socket.sketchCode);
        });

        socket.on('leave', function (data) {
            socket.leave(socket.sketchCode);
            console.log(`left the sketch ${socket.sketchCode}`);
            socket.sketchCode = undefined
        });

        socket.on('sketch.username.change', function(username) {
            socket.sketch.username =  username;
            socket.sketch.fetchedUser = undefined;

            // io.sockets.to(socket.sketchCode).emit('sketch.username.change', username);
            io.sockets.to(socket.sketchCode).emit('redirect', socket.sketch.links.show);
        });

        socket.on('sketch.image.change', function() {
            // socket.sketch.changeImg(img);
            socket.sketch.updateImg();
            io.sockets.to(socket.sketchCode).emit('sketch.image.change', socket.sketch.links.publicImg);
        });

        socket.on('sketch.image.nchange', function(n) {
            // socket.sketch.changeImg(img);
            socket.sketch.updateNImg(n);
            io.sockets.to(socket.sketchCode).emit('sketch.image.nchange', socket.sketch.imgs[n]);
        });

        socket.on('sketch.close', function() {
            io.sockets.to(socket.sketchCode).emit('redirect', '/');
            socket.sketch.close();
            socket.leave(socket.sketchCode);
            sketchManager.delete(socket.sketchCode);
            console.log(`sketch ${socket.sketchCode} ended`);
            socket.sketch = undefined
        });
        
    });
}



