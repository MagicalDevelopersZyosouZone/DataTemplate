function SimpleEventTarget() {
    var _listeners = new Map();
    var _listenerCount = 0;
    this.callEvent = function () {
        _listeners.forEach(function (value) {
            value();
        });
    };
    this.listen = function (callback) {
        _listeners.set(_listenerCount, callback);
        return _listenerCount++;
    };
    this.unlisten = function (id) {
        _listeners.delete(id);
    };
}

function ObservableList() {
    SimpleEventTarget.call(this);

    var closureThis = this;

    var _items = new Array();
    var maxIndexer = -1;

    Object.defineProperty(this, "internalArray", {
        get: function () {
            return _items;
        }
    });
    Object.defineProperty(this, "length", {
        get: function () {
            return _items.length;
        }
    });

    function itemPropertyChange() {
        closureThis.callEvent();
    }

    function listenObject(obj) {
        if (obj instanceof SimpleEventTarget) {
            obj.listen(itemPropertyChange);
        }
    }

    this.setIndexer = function () {
        while (setIndexerInner());
    }

    function setIndexerInner() {
        if (maxIndexer < _items.length - 1) {
            maxIndexer++;
            var closureIndex = maxIndexer;
            Object.defineProperty(closureThis, maxIndexer.toString(), {
                get: function () {
                    return this.getItem(closureIndex);
                }
            });
            return true;
        }
        return false;
    }

    this.getItem = function (index) {
        return _items[index];
    }
    this.setItem = function (index, item) {
        listenObject(item);
        _items[index] = item;
        this.setIndexer();
        this.callEvent();
    };

    this.add = function (item) {
        listenObject(item);
        _items.push(item);
        this.setIndexer();
        this.callEvent();
    };
    this.removeAt = function (index) {
        _items.splice(index, 1);
        this.callEvent();
    };
    this.insert = function (index, item) {
        listenObject(item);
        _items.splice(index, 0, item);
        this.setIndexer();
        this.callEvent();
    };
    this.clear = function () {
        _items = new Array();
        this.callEvent();
    };
};
ObservableList.prototype = Object.create(SimpleEventTarget.prototype);
ObservableList.prototype.constructor = ObservableList;

function ObservableObject(obj) {
    SimpleEventTarget.call(this);

    var closureThis = this;

    function setProp(prop) {
        if (typeof (prop) != "function") {
            var field = obj[prop];
            Object.defineProperty(closureThis, prop, {
                get: function () {
                    return field;
                },
                set: function (val) {
                    field = val;
                    closureThis.callEvent();
                }
            });
        } else {
            closureThis[prop] = obj[prop];
        }
    }

    for (var prop in obj) {
        setProp(prop);
    }
}
ObservableObject.prototype = Object.create(SimpleEventTarget.prototype);
ObservableObject.prototype.constructor = ObservableObject;