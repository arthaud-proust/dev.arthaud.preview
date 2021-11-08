class Chrono {
    constructor(delay=100, increment=1) {
        this._time = 0;
        this.delay = delay;
        this.increment = increment;

        this._actions = {};
    }

    init() {
        setInterval(()=>this.refresh(), this.delay);
    }

    refresh() {
        this._time += this.increment;

        for(const [id, action] of Object.entries(this._actions)) {
            if(action.time<this._time) { // delete past actions
                this.delete(id);
            }

            if(action.time===this._time) { // call actual actions
                action.fn();
                this.delete(id);
            }
        }
    }

    register(fn, time, id=false) {
        if(!id) id = `${Date.now()}${Math.round(Math.random()*100)}`;

        this._actions[id] = {
            fn,
            time
        }

        return id;
    }

    in(fn, inTime, id=false) {
        return this.register(fn, this._time+inTime, id);
    }

    delete(id) {
        delete this._actions[id];
    }
}