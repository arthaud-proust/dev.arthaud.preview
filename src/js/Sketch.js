const axios = require('axios');
const path = require('path');
const u = require('./Utils');
const fs = require('fs');
const SketchImage = require('./SketchImage');

module.exports = class Sketch {
    constructor(sketchManager, code) {
        this.sketchManager = sketchManager;
        this.code = code;

        this.paths = {
            shareUrl: `https://preview.arthaud.dev/${this.code}`,
            folder: path.join(__dirname, '../../public/sketchs/'+this.code),
            imagesFolder: '/sketchs/'+this.code,
            // show: `/${this.code}`,
            // edit: `/${this.code}/edit`,
        }

        this.imgs = {};
        this._disposition = [];
        this._orderedImgs = [];
        this._mode = 'grid';
        this._active = '';
        
        // defaults imgs
        this.fillImgs();

        u.mkdir(this.paths.folder);

    }

    getData() {
        return({
            active: this._active,
            mode: this._mode,
            code: this.code,
            paths: this.paths,
            orderedImgs: this._orderedImgs
        });
    }
    
    setMode(mode) {
        this._mode = mode;
    }

    setActive(active) {
        this._active = active;
    }

    setDisposition(disposition) {
        this._disposition = disposition;
        this.updateOrderedImgs();
    }

    updateOrderedImgs() {
        this._orderedImgs = [];
        for(let i=0; i<this._disposition.length; i++) {
            this._orderedImgs.push(this.imgs[this._disposition[i]].getData());
        }
    }

    close() {
        u.rmdir(this.paths.folder);
    }

    fillImgs() {
        for(let n=0; n<5; n++) {
            this.createImg();
        }
        this.updateOrderedImgs();
    }


    createImg() {
        const newImage = new SketchImage(this.paths.imagesFolder, this._disposition.length);
        this.imgs[newImage.getUuid()] = newImage;
        this._disposition.push(newImage.getUuid());
        this.updateOrderedImgs();
        return newImage.getData();
    }

    updateImg(uuid) {
        if(Object.keys(this.imgs).includes(uuid)) {
            let updated = this.imgs[uuid].update();
            this.updateOrderedImgs();
            return updated;
        } else {
            console.error('Invalid uuid');
        }
    }

    deleteImg(uuid) {
        delete this.imgs[uuid];
        this._disposition.splice(this._disposition.indexOf(uuid), 1);
        this.updateOrderedImgs();
    }
}