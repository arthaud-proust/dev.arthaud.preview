const Sketch = require('./sketch');
const fs = require('fs');
const path = require('path');
module.exports = class SteckManager {
    constructor() {
        this.codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-';
        this.codeLen = 6;
        this.sketchs = {};
        this.members = [];

        this.load();
    }

    validCode(code) {
        return /[ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-]{6}/g.test(code)
    }

    sketchExist(code) {
        return Object.keys(this.sketchs).includes(code)
    }

    load() {
        const sketchsCodes = fs.readdirSync( path.join(__dirname, '../../public/sketchs'))
        for(let sketchCode of sketchsCodes) {
            this.sketchs[sketchCode] = new Sketch(this, sketchCode);
        }
    }

    create(code=null) {
        if(code==null || !this.validCode(code) || this.sketchExist(code)) {
            code = Array(this.codeLen).fill('-').map(()=>{
                return this.codeChars[Math.floor(Math.random()*this.codeChars.length)];
            }).join('');

            return this.create(code);
        }
        console.log(`sketchManager.js: new sketch: ${code}`);
        this.sketchs[code] = new Sketch(this, code);

        // console.log(this.sketchs['AAAAA'])
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
            return new Sketch(this, null, []);
        } else {
            return this.sketchs[code]
        }
    }
    handle(req, res, callback) {
        if(req.params.code==null || !this.validCode(req.params.code) || !this.sketchExist(req.params.code)) {
            res.redirect('/404' );
        } else {
            const sketch = this.getSketch(req.params.code);
            sketch.fetchUserIfNeeded().then(()=>{
                callback(sketch)
            });
        }
    }
}