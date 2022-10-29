const Sketch = require('./Sketch');
const fs = require('fs');
const path = require('path');
module.exports = class SketchManager {
    constructor() {
        this.codeCharsMiddle = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-';
        this.codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        this.codeLen = 6;
        this.sketchs = {};
        this.members = [];

        this.sketchsFolder = path.join(__dirname, '../../public/sketchs');

        this.load();
    }

    validCode(code) {
        return /[ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-]{6}/g.test(code)
    }

    sketchExist(code) {
        return Object.keys(this.sketchs).includes(code)
    }

    createSketchFolderIfNeeded() {
        if (!fs.existsSync( this.sketchsFolder )) {
            fs.mkdirSync( this.sketchsFolder, { recursive: true })
        }
    }

    load() {
        this.createSketchFolderIfNeeded();

        const sketchsCodes = fs.readdirSync( this.sketchsFolder )
        for(let sketchCode of sketchsCodes) {
            this.sketchs[sketchCode] = new Sketch(this, sketchCode);
        }
    }

    create(code=null) {
        if(code===null || !this.validCode(code) ) {
            code = Array(this.codeLen).fill('-').map((e,i)=>{
                return ( (i>0 && i<this.codeLen-1) 
                    ? this.codeCharsMiddle[Math.floor(Math.random()* this.codeCharsMiddle.length)]
                    : this.codeChars[Math.floor(Math.random()* this.codeChars.length)]
                );
            }).join('');

            return this.create(code);
        }

        if(this.sketchExist(code)) {
            console.log(`sketchManager.js: sketch already exists: ${code}, returned`);
            return this.sketchs[code];
        }
        console.log(`sketchManager.js: new sketch: ${code}`);
        this.sketchs[code] = new Sketch(this, code);

        return this.sketchs[code];
    }

    delete(code) {
        try {
            delete this.sketchs[code];
        } catch(e){}
        console.log(`sketchManager.js: end sketch: ${code}`);
        return
    }

    getSketch(code) {
        if(code==null || !this.validCode(code) || !this.sketchExist(code)) {
            return new Sketch(this, null);
        } else {
            return this.sketchs[code]
        }
    }

    handle(req, res, callback) {
        if (typeof req.params.code === 'string' || req.params.code instanceof String) req.params.code = req.params.code.toUpperCase();
        if(req.params.code==null || !this.validCode(req.params.code) || !this.sketchExist(req.params.code)) {
            res.redirect('/error/404' );
        } else {
            callback(this.getSketch(req.params.code));
        }
    }
}