


socket.on("connect", () => {
    socket.emit('join', {sketchCode});
    console.log('joined');
});

socket.on("sketch.image.change", img=>{
    console.log('img received');
    console.log(img);
    document.getElementById('imgElement').src=img;
})

window.onunload = window.onbeforeunload = () => {
    socket.emit('leave');
    socket.close();
};

try {

document.getElementById('imgField').addEventListener('change', function(evt) {

    var formData = new FormData();
    formData.append(sketchCode, document.getElementById('imgField').files[0]);
    for (var value of formData.values()) {
        console.log(value);
     }
    axios.post(`/sketch/${sketchCode}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }).then(r=>{
        if(r.data == "all done") {
            socket.emit('sketch.image.change');
        }
    });
})
}catch(e){};


try {
document.getElementById('editionSubmit').addEventListener('click', function(evt) {
    socket.emit('sketch.username.change', document.getElementById('username').value);
});
document.getElementById('closeSketch').addEventListener('click', function() {
    socket.emit('sketch.close');
    console.log('ee');
});
}catch(e){};
