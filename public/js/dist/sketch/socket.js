const socket = io.connect(window.location.origin);

window.addEventListener('focus', function() {
    socket.connect();
});

socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
    // else the socket will automatically try to reconnect
});

socket.on("connect", () => {
    console.log('connect');
    socket.emit('sketch.join', {
        sketchCode: document.getElementById('gallery').dataset.sketchCode
    });
});

socket.on("sketch.close", () => {
    window.location.href = '/';
});

socket.on("connect_error", (error) => {
    console.log(error);
});

window.onunload = window.onbeforeunload = () => {
    socket.emit('sketch.leave');
    socket.close();
};

function emitCloseSketch() {
    socket.emit('sketch.close');
}


socket.on("image.uploading", ({uuid, avancement}) => {
    setImageLoadingAvancement(uuid, avancement);
});
function emitUploadingImage(uuid, avancement) {
    setImageLoadingAvancement(uuid, avancement);
    socket.emit('image.uploading', {uuid, avancement});
}

socket.on("image.changed", ({uuid, path, version}) => {
    updateImageData(uuid, path, version);
});
function emitChangedImage(uuid, path, version) {
    updateImageData(uuid, path, version);
    socket.emit('image.changed', {uuid, path, version});
}

socket.on("image.delete", ({uuid}) => {
    deleteImage(uuid);
});
function emitDeleteImage(uuid) {
    deleteImage(uuid);
    socket.emit('image.delete', {uuid});
}

socket.on("image.create", ({uuid, path, version}) => {
    createImage(uuid, path, version);
});
function emitCreateImage(uuid) {
    // not twice because need to fetch data from server
    socket.emit('image.create', {uuid});
}

socket.on("disposition.changed", ({image, insertBefore}) => {
    moveImage(image, insertBefore);
});
function emitChangeDisposition(image, insertBefore) {
    moveImage(image, insertBefore);
    socket.emit('disposition.change', {
        image, 
        insertBefore, 
        globalDisposition: Array.from(document.querySelectorAll('.image')).map(img=>img.dataset.uuid)
    });
}

socket.on("disposition.switchTo", ({mode, translateTo}) => {
    switchTo(mode);
    if(translateTo) setActive(translateTo, true);
});
function emitSwitchDisposition(mode, translateTo) {
    switchTo(mode);
    if(translateTo) setActive(translateTo, true);
    socket.emit('disposition.switchTo', {mode, translateTo});
}

socket.on("disposition.translateCarousel", ({direction}) => {
    translateCarousel(direction);
});
function emitTranslateCarousel(direction) {
    translateCarousel(direction); 
    socket.emit('disposition.translateCarousel', {direction});
}

socket.on("disposition.setActive", ({uuid, translate}) => {
    setActive(uuid, translate);
});
function emitSetActive(uuid, translate) {
    setActive(uuid, translate);
    socket.emit('disposition.setActive', {uuid, translate});
}