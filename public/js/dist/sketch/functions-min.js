function getActiveCarouselImage(){return getImageByUuid(document.getElementById("gallery").dataset.active)}function isGalleryCarousel(){return document.querySelector("#gallery").classList.contains("gallery-carousel")}function isGalleryGrid(){return document.querySelector("#gallery").classList.contains("gallery-grid")}function getImageByUuid(e){return document.querySelector(`.image[data-uuid="${e}"]`)}function getImageByIndex(e){return document.querySelectorAll(".image")[e]}function getImageIndex(e){return Array.from(document.querySelectorAll(".image")).indexOf(e)}function getImageIndexByUuid(e){const t=getImageByUuid(e);return t?getImageIndex(t):-1}function updateActiveImg(){document.querySelectorAll('.image[data-active="true"]').forEach((e=>e.dataset.active=!1));const e=getActiveCarouselImage();e&&(e.dataset.active=!0)}function toggleMenu(){document.getElementById("menu").classList.toggle("mobile-open")}function handleArrowsForI(e=document.getElementById("gallery").dataset.carouselI){isGalleryGrid()?(document.getElementById("carouselLeft").classList.add("hidden"),document.getElementById("carouselRight").classList.add("hidden")):(document.getElementById("carouselLeft").classList.toggle("hidden",0==e),document.getElementById("carouselRight").classList.toggle("hidden",e==document.querySelectorAll(".image").length-1))}function translateCarousel(e){if(isGalleryGrid())return;const t=parseInt(document.querySelector("#gallery").dataset.carouselI)+e,a=document.querySelectorAll(".image").length-1;if(t<0||a<t)return;handleArrowsForI(t);const r=document.querySelectorAll(".image")[t];emitSetActive(r.dataset.uuid,!1),document.querySelector("#gallery").dataset.carouselI=t;const n=window.getComputedStyle(r).getPropertyValue("width"),o=parseInt(document.querySelector("#gallery").dataset.carouselI)*-parseInt(n.replace("px",""));gsap.to("#gallery-inner",{duration:.7,x:o,y:0})}function translateCarouselTo(e){const t=document.querySelector("#gallery").dataset.carouselI;translateCarousel(getImageIndexByUuid(e)-t)}function translateGrid(e){if(isGalleryCarousel())return;const t=parseInt(document.querySelector("#gallery").dataset.gridI)+e,a=Math.floor((document.querySelectorAll(".image").length-1)/3);if(t<0||a<t)return;document.querySelector("#gallery").dataset.gridI=t;const r=parseInt(window.getComputedStyle(document.body).getPropertyValue("width").replace(/\W+/gm,""))/3,n=parseInt(document.querySelector("#gallery").dataset.gridI)*-r;gsap.to("#gallery-inner",{duration:.7,y:n,x:0})}function switchTo(e){"grid"===e?(document.querySelector("#gallery").classList.replace("gallery-carousel","gallery-grid"),document.getElementById("carousel-controls").classList.add("hidden"),document.querySelector(".menu-view-grid").classList.add("hidden"),document.querySelector(".menu-view-carousel").classList.remove("hidden"),translateGrid(0)):"carousel"===e&&(document.querySelector("#gallery").classList.replace("gallery-grid","gallery-carousel"),document.getElementById("carousel-controls").classList.remove("hidden"),document.querySelector(".menu-view-grid").classList.remove("hidden"),document.querySelector(".menu-view-carousel").classList.add("hidden"),translateCarouselTo(document.querySelector("#gallery").dataset.active))}function setActive(e,t=!1){if(""===e)return;const a=getImageByUuid(e);a&&a.classList.contains("image")&&(document.getElementById("gallery").dataset.active=e,updateActiveImg(),t&&translateCarouselTo(e))}function registerEventsForAllImage(){document.querySelectorAll(".image").forEach((e=>registerEventsForImage(e)))}function registerEventsImageActions(e){e.querySelector(".image-fullscreen").addEventListener("click",(function(t){closeIfPopup(e),emitSwitchDisposition("carousel",e.dataset.uuid)})),e.querySelector(".image-download").addEventListener("click",(function(t){closeIfPopup(e),downloadImage(e.dataset.uuid)})),e.querySelector(".image-delete").addEventListener("click",(function(t){closeIfPopup(e),emitDeleteImage(e.dataset.uuid)})),e.querySelector(".image-edit").addEventListener("click",(function(t){closeIfPopup(e);var a=document.querySelector("#editPopup");a.classList.add("open"),a.dataset.imageUuid=e.dataset.uuid}))}function registerEventsForImage(e){const t=e.cloneNode(!0);e.replaceWith(t),(e=t).addEventListener("contextmenu",(function(t){t.preventDefault();var a=document.querySelector("#imageActionsPopup");(a=openIfPopup(a)).dataset.uuid=e.dataset.uuid,registerEventsImageActions(a,e)})),e.addEventListener("dragstart",(function(e){e.dataTransfer.setData("text/html",e.target.children[0].getAttribute("id"))})),e.addEventListener("dragover",(function(e){e.preventDefault(),e.dataTransfer.dropEffect="move"})),e.addEventListener("drop",(function(e){e.preventDefault();const t=e.dataTransfer.getData("text/html");if(!t)return;const a=document.getElementById(t).closest(".image");var r=Array.from(document.querySelectorAll(".image"));const n=e.target.closest(".image"),o=r.indexOf(a),l=r.indexOf(n),d=o>l?n:r[l+1];d&&emitChangeDisposition(a.dataset.uuid,d.dataset.uuid)}))}function moveImage(e,t){const a=document.querySelector(`.image[data-uuid="${e}"]`),r=document.querySelector(`.image[data-uuid="${t}"]`);document.getElementById("gallery-inner").insertBefore(a,r),updateActiveImg(),translateCarouselTo(e)}function setImageLoadingAvancement(e,t){const a=document.querySelector(`.image[data-uuid="${e}"]`),r=a.querySelector(".image-loadBar"),n=a.querySelector(".image-loadBar-bar");r.classList.toggle("loading",t<100),n.style.width=`${t}%`}function updateImageData(e,t,a){const r=document.querySelector(`.image[data-uuid="${e}"]`);r.dataset.version=a,r.dataset.src=`${t}?v=${a}`,r.querySelector(".image-container").style=`background-image: url(${r.dataset.src})`}function deleteImage(e){document.querySelector(`.image[data-uuid="${e}"]`).remove()}function createImage(e,t,a){document.getElementById("gallery-inner").innerHTML+=newImageEl;document.getElementById("gallery-inner").lastChild.dataset.uuid=e,updateImageData(e,t,a),registerEventsForAllImage(),handleArrowsForI()}async function downloadImage(e){const t=document.querySelector(`.image[data-uuid="${e}"]`),a=await fetch(t.dataset.src),r=await a.blob(),n=URL.createObjectURL(r),o=document.createElement("a");o.href=n,o.download=`${document.getElementById("gallery").dataset.sketchCode}-${getImageIndex(t)}-v${t.dataset.version}`,document.body.appendChild(o),o.click(),document.body.removeChild(o)}function oldThings(){}