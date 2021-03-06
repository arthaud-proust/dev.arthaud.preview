const { v1: uuidv1 } = require('uuid');

module.exports = class SketchImage {
    constructor(publicFolderPath, index=0, tuto=false, uuid=null) {
        this.publicFolderPath = publicFolderPath;

        this._uuid = uuid || uuidv1();
        this._index = index;
        this._place = this._index*2;
        this._version = 1;
        // this._defaultPath = `https://picsum.photos/1000?random=${this._uuid}`;
        // this._defaultPath = `/static/default.jpg`;
        this._defaultPath = tuto?`/static/help-${index}.jpg`:`/static/default.jpg`;
        // this._defaultPath = `/static/default${index}.jpg`;
        // this._defaultPath = `/static/default${1}.jpg`;
        // this._defaultPath = `https://eu.ui-avatars.com/api/?size=256&name=${index+1}`;
        this._path = uuid?`${this.publicFolderPath}/${this._uuid}.jpg`:this._defaultPath;
        
    }

    getData() {
        return {
            index: this._index,
            version: this._version,
            path: this._path,
            uuid: this._uuid
        }
    }

    getIndex() {
        return this._index;
    }

    getPlace() {
        return this._place;
    }

    setIndex(i) {
        this._index = i;
    }

    getVersion() {
        return this._version;
    }

    getPath() {
        return `${this._path}?v=${this._version}`;
    }

    getUuid() {
        return this._uuid;
    }

    update() {
        // increment version
        this._version++;

        // change path from default to actual image path.
        this._path = `${this.publicFolderPath}/${this._uuid}.jpg`;
        return {
            version: this._version,
            path: this._path
        };
    }
}