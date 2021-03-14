


socket.on("connect", () => {
    socket.emit('join', {sketchCode});
    console.log('joined');
});

socket.on("sketch.image.change", img=>{
    console.log('img received');
    console.log(img);
    document.getElementById('imgElement').src=img;
})

socket.on("sketch.image.nchange", imgDetails=>{
    console.log('img received');
    console.log(imgDetails);
    document.getElementById('img-'+imgDetails.n).src=imgDetails.src;
})

window.onunload = window.onbeforeunload = () => {
    socket.emit('leave');
    socket.close();
};

document.querySelectorAll('input[id^="imgField"]').forEach(imgField=> {
    imgField.addEventListener('change', function(evt) {

        var formData = new FormData();
        formData.append(imgField.dataset.n, imgField.files[0]);
        axios.post(`/sketch/${sketchCode}/upload/${imgField.dataset.n}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }).then(r=>{
            if(r.data.n) {
                socket.emit('sketch.image.nchange', r.data.n);
            }
        });
    })
});


try {
document.getElementById('editionSubmit').addEventListener('click', function(evt) {
    socket.emit('sketch.username.change', document.getElementById('username').value);
});
}catch(e){};
try {
document.getElementById('closeSketch').addEventListener('click', function() {
    console.log('ee');
    socket.emit('sketch.close');
});
}catch(e){};
