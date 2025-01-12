// Since JS doesnt have default map like Python
export class DefaultMap extends Map {
    get(key) {
        if (!this.has(key)) {
        this.set(key, this.default());
        }
        return super.get(key);
    }

    constructor(defaultFunction, entries) {
        super(entries);
        this.default = defaultFunction;
    }
}

// Since JS doesnt have Counter like Python
export class Counter extends DefaultMap {
    get(key) {
        if (!this.has(key)) {
        this.set(key, this.default());
        }
        return super.get(key);
    }

    increase(key) {
        this.set(key, this.get(key)+1)
    }

    diff(counter) {
        let diffMap = new Map();
        this.forEach((a, key) => {
            var b = counter.get(key);
            if (a != b)
                diffMap.set(key, Math.abs(a - b))
        });
        return diffMap
    }

    constructor() {
        super(() => 0);
    }
}