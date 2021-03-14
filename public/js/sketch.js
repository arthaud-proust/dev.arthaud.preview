


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



try{
    const innerViewer = document.querySelector('.vi798 ');
    const viewer = document.querySelector('._97aPb ');
    const nextViewBtn = document.querySelector('button._6CZji')
    const prevViewBtn = document.querySelector('button.POSa_')
    const dots = document.querySelectorAll('.Yi5aA ')

    const handleViewChange = function() {
        nextViewBtn.style=innerViewer.dataset.x == 9?"display:none":"display:block";
        prevViewBtn.style=innerViewer.dataset.x == 0?"display:none":"display:block";
        dots.forEach(dot=>dot.classList.remove('XCodT'));
        dots[parseInt(innerViewer.dataset.x)].classList.add('XCodT');
    }
    // 
    nextViewBtn.addEventListener('click', function() {
        if(innerViewer.dataset.x == 9) return;
        innerViewer.dataset.x = parseInt(innerViewer.dataset.x)+1;
        innerViewer.style = `transition: transform 363.693ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s; transform: translateX( calc( ${innerViewer.dataset.x} * -360px) );`;
        viewer.style = "overflow-x:hidden;";
        handleViewChange()
    })

    prevViewBtn.addEventListener('click', function() {
        if(innerViewer.dataset.x == 0) return;
        innerViewer.dataset.x = parseInt(innerViewer.dataset.x)-1;
        innerViewer.style = `transition: transform 363.693ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s; transform: translateX( calc( ${document.querySelector('.vi798 ').dataset.x} * -360px) );`;
        viewer.style = "overflow-x:hidden;";
        handleViewChange()
    })
}catch(e){};