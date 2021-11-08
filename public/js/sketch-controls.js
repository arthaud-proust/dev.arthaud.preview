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
    
    setActive(document.getElementById('gallery').dataset.active);
    // handleArrowsForI();
    
    document.getElementById('carouselLeft').addEventListener('click', function() { 
        emitTranslateCarousel(-1);
    });
    document.getElementById('carouselRight').addEventListener('click', function() { 
        emitTranslateCarousel(1);
    });
    document.addEventListener('keydown', function(e) { 
        e = e || window.event;
        console.log(e.key);
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
        emitCloseSketch();
    })
    
    
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