document.querySelectorAll('.popup .popup-outter').forEach(el=>{
    el.addEventListener('click',function(){
        this.parentElement.classList.remove('open');
    })
})


const editFileInput = document.getElementById('editFileInput');
editFileInput.addEventListener('change', function() {
    document.querySelector('#editPopup').classList.remove('open');
    var formData = new FormData();

    const imgUUID = editFileInput.closest('.popup').dataset.imageUuid;
    const sketchCode = document.getElementById('gallery').dataset.sketchCode;

    emitUploadingImage(imgUUID, 0);

    formData.append(imgUUID, editFileInput.files[0]);
    axios.post(`/${sketchCode}/upload/${imgUUID}`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            // console.log("onUploadProgress", totalLength);
            if (totalLength !== null) {
                const avancement = Math.round( (progressEvent.loaded * 100) / totalLength );
                emitUploadingImage(imgUUID, avancement);
            }
        }
    }).then(r=>{
        if(r.data.done) {
            const {uuid, path, version} = r.data;
            emitChangedImage(uuid, path, version);
        }
    });
})