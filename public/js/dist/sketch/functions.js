// function getActiveCarouselImage() { return document.querySelector('.image[data-carousel-active="true"]') }
function getActiveCarouselImage() { return getImageByUuid(document.getElementById('gallery').dataset.active) }
function isGalleryCarousel() { return document.querySelector('#gallery').classList.contains('gallery-carousel') }
function isGalleryGrid() { return document.querySelector('#gallery').classList.contains('gallery-grid') }
function getImageByUuid(uuid) {
    return document.querySelector(`.image[data-uuid="${uuid}"]`);
}
function getImageByIndex(i) {
    return document.querySelectorAll(`.image`)[i];
}
function getImageIndex(img) {
    const imgs = Array.from(document.querySelectorAll('.image'));
    return imgs.indexOf(img);
}
function getImageIndexByUuid(uuid) {
    const img = getImageByUuid(uuid);
    return img?getImageIndex(img):-1;
}

function updateActiveImg() {
    // de-active all img;
    document.querySelectorAll('.image[data-active="true"]').forEach(img=>img.dataset.active = false);
    const imgToSetActive = getActiveCarouselImage();
    if(imgToSetActive) imgToSetActive.dataset.active = true;
}

function toggleMenu() {
    document.getElementById('menu').classList.toggle('mobile-open');
}

function handleArrowsForI(i=document.getElementById('gallery').dataset.carouselI ) {
    if(isGalleryGrid()) {
        document.getElementById('carouselLeft').classList.add('hidden');
        document.getElementById('carouselRight').classList.add('hidden');
    } else {
        document.getElementById('carouselLeft').classList.toggle('hidden', i==0);
        document.getElementById('carouselRight').classList.toggle('hidden', i==document.querySelectorAll('.image').length-1);
    }
}


function translateCarousel(direction) {
    if(isGalleryGrid()) return;
    // console.log('translate '+direction);
    const iBeforeTranslation = parseInt(document.querySelector('#gallery').dataset.carouselI)
    const iAfterTranslation = iBeforeTranslation+direction;
    const maxI = document.querySelectorAll('.image').length-1;
    if(iAfterTranslation<0 || maxI<iAfterTranslation) return;

    handleArrowsForI(iAfterTranslation);

    const newActive = document.querySelectorAll('.image')[iAfterTranslation];

    emitSetActive(newActive.dataset.uuid, false);
    document.querySelector('#gallery').dataset.carouselI = iAfterTranslation;

    const imageWidth = window.getComputedStyle(newActive).getPropertyValue('width');
    const newDist = parseInt(document.querySelector('#gallery').dataset.carouselI) * - parseInt(imageWidth.replace('px',''));

    gsap.to("#gallery-inner", {duration: 0.7, x: newDist, y:0});
}
function translateCarouselTo(uuid) {
    const Iactual = document.querySelector('#gallery').dataset.carouselI;
    const Iactive = getImageIndexByUuid(uuid);
    const diff = Iactive-Iactual;
    translateCarousel(diff);
}

function translateGrid(direction) {
    if(isGalleryCarousel()) return;
    const iAfterTranslation = parseInt(document.querySelector('#gallery').dataset.gridI)+direction;
    const maxI = Math.floor((document.querySelectorAll('.image').length-1)/3);
    if(iAfterTranslation<0 || maxI<iAfterTranslation) return;

    document.querySelector('#gallery').dataset.gridI = iAfterTranslation;

    const lineHeight = parseInt(window.getComputedStyle(document.body).getPropertyValue('width').replace(/\W+/gm, ''))/3;

    const newDist =parseInt(document.querySelector('#gallery').dataset.gridI) * -lineHeight;
    gsap.to("#gallery-inner", {duration: 0.7, y: newDist, x:0});
}

function switchTo(mode) {
    // emitSetActive(getActiveCarouselImage().dataset.uuid);
    if(mode==='grid') {
        document.querySelector('#gallery').classList.replace('gallery-carousel', 'gallery-grid');
        document.getElementById('carousel-controls').classList.add('hidden');
        document.querySelector('.menu-view-grid').classList.add('hidden');
        document.querySelector('.menu-view-carousel').classList.remove('hidden');
        translateGrid(0);
    } else if(mode==='carousel') {
        document.querySelector('#gallery').classList.replace('gallery-grid', 'gallery-carousel');
        document.getElementById('carousel-controls').classList.remove('hidden');
        document.querySelector('.menu-view-grid').classList.remove('hidden');
        document.querySelector('.menu-view-carousel').classList.add('hidden');
        translateCarouselTo(document.querySelector('#gallery').dataset.active);
    }
}


function setActive(uuid, translate=false) { // change img active in carousel
    if(uuid==='') return;
    const imgToSetActive = getImageByUuid(uuid);
    if(!imgToSetActive || !imgToSetActive.classList.contains('image')) return;

    document.getElementById('gallery').dataset.active = uuid;
    updateActiveImg();

    if(translate) translateCarouselTo(uuid);
}
function registerEventsForAllImage() {
    document.querySelectorAll('.image').forEach(img=>registerEventsForImage(img));
}

function registerEventsImageActions(el) {
    el.querySelector('.image-fullscreen').addEventListener('click', function(e) {
        closeIfPopup(el);

        emitSwitchDisposition('carousel', el.dataset.uuid);
        // emitSetActive(el.dataset.uuid, true);
    });
    el.querySelector('.image-download').addEventListener('click', function(e) {
        closeIfPopup(el);
        downloadImage(el.dataset.uuid);
    });
    el.querySelector('.image-delete').addEventListener('click', function(e) {
        closeIfPopup(el);
        emitDeleteImage(el.dataset.uuid);
    });

    el.querySelector('.image-edit').addEventListener('click', function(e) {
        closeIfPopup(el);

        var popupEl = document.querySelector('#editPopup');
        popupEl.classList.add('open');
        popupEl.dataset.imageUuid = el.dataset.uuid;
    })
}

function registerEventsForImage(img) {
    const clone = img.cloneNode(true);
    img.replaceWith(clone);
    img = clone;
    // console.log('e');
    // img.parentNode.replaceChild
    // img.addEventListener('click', function(e) {
    //     emitSetActive(img.dataset.uuid);
    // })

    // registerEventsImageActions(img, img);


    img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        var popupEl = document.querySelector('#imageActionsPopup');
        popupEl = openIfPopup(popupEl); // re assignement to keep same value (because of clone)
        popupEl.dataset.uuid = img.dataset.uuid;
        registerEventsImageActions(popupEl, img);
    })

    // handle drag & drop
    img.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData("text/html", e.target.children[0].getAttribute('id')); 
    })

    img.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    })
    img.addEventListener('drop', function(e) {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/html");
        if(!data) return;
        const imgDragged = document.getElementById(data).closest('.image');
        var imgs = Array.from(document.querySelectorAll('.image'));
        const target = e.target.closest('.image');
        const IimgDragged = imgs.indexOf(imgDragged);
        const Itarget = imgs.indexOf(target);

        const destination = IimgDragged>Itarget ? target : imgs[Itarget+1];

        // console.log(imgDragged);
        // console.log(destination);
        if(!destination) return;

        emitChangeDisposition(imgDragged.dataset.uuid,destination.dataset.uuid);
    })
}

function moveImage(imageUUID, insertBeforeUUID) {
    const image = document.querySelector(`.image[data-uuid="${imageUUID}"]`);
    const insertBefore = document.querySelector(`.image[data-uuid="${insertBeforeUUID}"]`);
    // console.log(image);

    // var imgs = Array.from(document.querySelectorAll('.image'));
    // const Iactive = imgs.indexOf(getActiveCarouselImage());
    // imgs[Iactive].dataset.carouselActive = false;

    document.getElementById('gallery-inner').insertBefore(image, insertBefore);

    updateActiveImg();
    // imgs = Array.from(document.querySelectorAll('.image'));
    // imgs[Iactive].dataset.carouselActive = true;

    translateCarouselTo(imageUUID);
}

function setImageLoadingAvancement(uuid, avancement) {
    const image = document.querySelector(`.image[data-uuid="${uuid}"]`);
    const loadingBar = image.querySelector('.image-loadBar');
    const loadingBarInner = image.querySelector('.image-loadBar-bar');

    loadingBar.classList.toggle('loading', avancement<100);

    loadingBarInner.style.width = `${avancement}%`;
}

function updateImageData(uuid, path, version) {
    const image = document.querySelector(`.image[data-uuid="${uuid}"]`);
    image.dataset.version = version;
    image.dataset.src = `${path}?v=${version}`;

    image.querySelector('.image-container').style = `background-image: url(${image.dataset.src})`;
}

function deleteImage(uuid) {
    const img = document.querySelector(`.image[data-uuid="${uuid}"]`);
    const i = getImageIndex(img);
    const imgAfter = getImageByIndex(i+1);
    const imgBefore = getImageByIndex(i-1);
    if (imgAfter) {
        emitSetActive(imgAfter.dataset.uuid)
    } else if(imgBefore) {
        translateCarouselTo(imgBefore.dataset.uuid)
    }
    img.remove();
    handleArrowsForI();
}
function createImage(uuid, path, version) {
    document.getElementById('gallery-inner').innerHTML += newImageEl;
    const newImage = document.getElementById('gallery-inner').lastChild;
    newImage.dataset.uuid = uuid;
    updateImageData(uuid, path, version);
    // registerEventsForImage(newImage);
    registerEventsForAllImage();

    const imgs = Array.from(document.querySelectorAll('.image'));
    translateCarouselTo(imgs[imgs.length-1].dataset.uuid);

    handleArrowsForI();

    // closeIfPopup(el);

    var popupEl = document.querySelector('#editPopup');
    popupEl.classList.add('open');
    popupEl.dataset.imageUuid = uuid;
}

async function downloadImage(imgUUID) {
    const imgEl = document.querySelector(`.image[data-uuid="${imgUUID}"]`);
    const image = await fetch(imgEl.dataset.src)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = `${document.getElementById('gallery').dataset.sketchCode}-${getImageIndex(imgEl)}-v${imgEl.dataset.version}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}