const Sketch = require('./sketch');

module.exports = class SteckManager {
    constructor() {
        this.codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        this.codeLen = 5;
        this.sketchs = {};
        this.members = [];

    }

    validCode(code) {
        return /[ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789]{5}/g.test(code)
    }

    sketchExist(code) {
        return Object.keys(this.sketchs).includes(code)
    }

    create(code=null) {
        if(code==null || !this.validCode(code) || this.sketchExist(code)) {
            code = Array(this.codeLen).fill('-').map(()=>{
                return this.codeChars[Math.floor(Math.random()*this.codeChars.length)];
            }).join('');

            return this.create(code);
        }
        console.log(`sketchManager.js: new sketch: ${code}`);
        this.sketchs[code] = new Sketch(this, code, ['adminsHere']);

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