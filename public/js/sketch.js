document.addEventListener('DOMContentLoaded', function() {

console.log('Dom loaded');

const baseHandleViewChange = function() {
    dots.forEach(dot=>dot.classList.remove('XCodT'));
    dots[parseInt(innerViewer.dataset.x)].classList.add('XCodT');
    document.querySelectorAll('.Ckrof .KL4Bh ')[parseInt(innerViewer.dataset.x)].style.height = document.querySelectorAll('img[id^="img-"]')[parseInt(innerViewer.dataset.x)].height+'px';
    document.querySelector('.tR2pe ').style.paddingBottom = document.querySelectorAll('img[id^="img-"]')[parseInt(innerViewer.dataset.x)].height+'px';

}

updateProgressBarValue = function(n, avancement) {
    document.querySelectorAll(`label[for^="imgField"]`)[n].classList.add('progressing')
    document.querySelectorAll(`label[for^="imgField"] .progress`)[n].style.width = `${avancement}%`
}

socket.on("connect", () => {
    socket.emit('join', {sketchCode});
    console.log('joined');
});

socket.on("connect_error", (error) => {
    console.log(error);
});

socket.on("sketch.image.change", img=>{
    console.log('img received');
    console.log(img);
    document.getElementById('imgElement').src=img;
    baseHandleViewChange()
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
            },
            onUploadProgress: (progressEvent) => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                console.log("onUploadProgress", totalLength);
                if (totalLength !== null) {
                    updateProgressBarValue(imgField.dataset.n, Math.round( (progressEvent.loaded * 100) / totalLength ));
                }
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
    const viewer = document.querySelector('._97aPb ');
    const nextViewBtn = document.querySelector('button._6CZji')
    const prevViewBtn = document.querySelector('button.POSa_')

    const handleViewChange = function() {
        nextViewBtn.style=innerViewer.dataset.x == 9?"display:none":"display:block";
        prevViewBtn.style=innerViewer.dataset.x == 0?"display:none":"display:block";
        baseHandleViewChange()
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


try {
    const handleViewChange = baseHandleViewChange
    var ongoingTouches = [];
    function ongoingTouchIndexById(idToFind) {
        for (var i=0; i<ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;
    
        if (id == idToFind) {
            return i;
        }
        }
        return -1;    // toucher non trouvé
    }
    document.querySelector('.ekfSF').addEventListener('touchstart', function(e) {
        e.preventDefault();
        var touches = e.changedTouches;

        ongoingTouches.push(touches[0]);
    })

    document.querySelector('.ekfSF').addEventListener('touchmove', function(e) {
        if(Math.abs(ongoingTouches[0].pageY-e.changedTouches[0].pageY) > 30) {
            return
        }
        let decal = document.querySelector('.vi798 ').dataset.x*-360+e.changedTouches[0].pageX-ongoingTouches[0].pageX
        if(decal>0 || decal< -9*360) {
            return
        }
        innerViewer.style = `transition: transform 363.693ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s; transform: translateX( calc( ${decal}px) );`;
    })

    document.querySelector('.ekfSF').addEventListener('touchend', function(e) {
        var touches = e.changedTouches;

        var idx = ongoingTouchIndexById(touches[0].identifier);
    
        let start = [ongoingTouches[0].pageX, ongoingTouches[0].pageY];
        let end = [touches[0].pageX, touches[0].pageY];

        if(end[0]-start[0] > 0) {
            if(innerViewer.dataset.x == 0) return;
            innerViewer.dataset.x = parseInt(innerViewer.dataset.x)-1;
            innerViewer.style = `transition: transform 363.693ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s; transform: translateX( calc( ${document.querySelector('.vi798 ').dataset.x} * -360px) );`;
        }
        if(end[0]-start[0] < 0) {
            if(innerViewer.dataset.x == 9) return;
            innerViewer.dataset.x = parseInt(innerViewer.dataset.x)+1;
            innerViewer.style = `transition: transform 363.693ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s; transform: translateX( calc( ${document.querySelector('.vi798 ').dataset.x} * -360px) );`;
        }

        ongoingTouches = [];  // On enlève les point

        handleViewChange();
    })

}catch(e){};




const dots = document.querySelectorAll('.Yi5aA ')
window.innerViewer = document.querySelector('.vi798 ');
window.imgs = document.querySelectorAll('img[id^="img-"]');
const save = document.getElementById('save');
imgs.forEach(img=>img.addEventListener('load', baseHandleViewChange))
baseHandleViewChange()
save.addEventListener('click', function() {
    console.log(imgs[innerViewer.dataset.x].src);
    downloadImage(imgs[innerViewer.dataset.x].src);
})
// document.location.href=document.querySelectorAll('img[id^="img-"]')


// end global scope
})



async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    let g = imgs[innerViewer.dataset.x].src.split('/');
    link.download = `${g[4]}-${(g[5].split('?'))[0]}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
