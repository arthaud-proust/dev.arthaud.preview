const chrono = new Chrono();
chrono.init();

document.addEventListener('DOMContentLoaded', function() {
    const controls = {
        visible: true,
        setVisible: function (visible) {
            this.visible = visible
            if(visible) {
                document.querySelectorAll('.controls').forEach(el=>el.style='');
                document.body.classList.remove('cursor-none');
            } else {
                document.querySelectorAll('.controls').forEach(el=>el.style='display: none !important');
                document.body.classList.add('cursor-none');
            }
        }
    }

    document.querySelectorAll('.menu-action.change-view').forEach(action=>{
        action.classList.toggle('hidden', action.dataset.actionName.includes(document.getElementById('gallery').dataset.mode));
    })
    
    setActive(document.getElementById('gallery').dataset.active, true);
    // handleArrowsForI();
    
    document.querySelector('#menu .menu-open').addEventListener('click', function() {
        toggleMenu();
    })

    document.getElementById('carouselLeft').addEventListener('click', function() { 
        emitTranslateCarousel(-1);
    });
    document.getElementById('carouselRight').addEventListener('click', function() { 
        emitTranslateCarousel(1);
    });
    document.addEventListener('keydown', function(e) { 
        e = e || window.event;
        switch(e.key) {
            case 'ArrowRight':
                controls.setVisible(false);
                emitTranslateCarousel(1);
                break;
            case 'ArrowLeft':
                controls.setVisible(false);
                emitTranslateCarousel(-1);
                break;
            
            case 'ArrowUp':
                // translateGrid(-1); 
                break;
            case 'ArrowDown':
                // translateGrid(1); 
                break;
            case 'g':
                emitSwitchDisposition('grid');
                break;
            case 'c':
                emitSwitchDisposition('carousel');
                break;
        }
    })
    
    document.querySelector('.menu-share').addEventListener('click', function() {
        document.querySelector('#sharePopup').classList.add('open')
    })
    document.querySelector('.menu-add').addEventListener('click', function() {
        emitCreateImage();
    })
    document.querySelector('.menu-view-grid').addEventListener('click', function() {
        emitSwitchDisposition('grid');
    });
    document.querySelector('.menu-view-carousel').addEventListener('click', function() {
        emitSwitchDisposition('carousel');
    });
    document.querySelector('.menu-delete').addEventListener('click', function() {
        var popupEl = document.querySelector('#deletePopup');
        popupEl.classList.add('open')
        // popupEl.dataset.uuid = img.dataset.uuid;
        // emitCloseSketch();
    })

    document.querySelector('#deletePopup .popup-action-cancel').addEventListener('click', function() {
        document.querySelector('#deletePopup').classList.remove('open')
    });
    document.querySelector('#deletePopup .popup-action-confirm').addEventListener('click', function() {
        emitCloseSketch();
    });


    document.querySelector('.menu-fullscreen').addEventListener('click', function(e) {
        document.querySelector('main').requestFullscreen();
        this.classList.add('hidden');
        document.querySelector('.menu-exit-fullscreen').classList.remove('hidden');

    });

    document.querySelector('.menu-exit-fullscreen').addEventListener('click', function(e) {
        document.querySelector('.menu-fullscreen').classList.remove('hidden');
        this.classList.add('hidden');
        document.exitFullscreen();
    });
    
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        controls.setVisible(!controls.visible)
    })
    
    registerEventsForAllImage();
    
    document.addEventListener('mousemove', function(e) {
        if(!controls.visible) controls.setVisible(true);
    });
    
    window.addEventListener('resize', function() {
        translateCarousel(0);
    })
    document.getElementById('gallery').addEventListener('scroll', function(e) {
        if(controls.visible) {
            controls.setVisible(false);
    
            chrono.in(function() {
                controls.setVisible(true);
            },5, 'displayMenu');
        }
    })
});