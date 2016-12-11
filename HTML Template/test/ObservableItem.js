// TODO: import library

function MyObservableObject() {
    SimpleEventTarget.call(this);

    var _name = "";
    Object.defineProperty(this, "name", {
        get: function () {
            return _name;
        },
        set: function (value) {
            _name = value;
            this.callEvent();
        }
    });
}
MyObservableObject.prototype = Object.create(SimpleEventTarget.prototype);
MyObservableObject.prototype.constructor = MyObservableObject;

var l = new ObservableList();
l.listen(function () {
    console.log(l.internalArray);
});
var o = new MyObservableObject();
l.add(o);
o.name = "Mitsuha";