function Pos(x, y) { this.x = x; this.y = y; }

function getElementPosition(el) {
    var elem = el;
    var w = elem.offsetWidth;
    var h = elem.offsetHeight;
    var l = 0;
    var t = 0;
    while (elem) {
        l += elem.offsetLeft;
        t += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return { "left": l, "top": t, "width": w, "height": h };
}

function getSize(elem) {
    var res = {
        width: parseInt(elem.style.width.replace('px', '')),
        height: parseInt(elem.style.height.replace('px', ''))
    };
    return res;
}

function globalEval(code) { // объединим два способа в одну функцию
    window.execScript ? execScript(code) : window.eval(code);
}


function getMargins(elem) {
    var top = 0, left = 0;
    while (elem.parentNode) {
        top = top + parseFloat(window.getComputedStyle(elem).marginTop.replace('px', ''));
        left = left + parseFloat(window.getComputedStyle(elem).marginLeft.replace('px', ''));
        elem = elem.parentNode;
    }

    return { top: Math.round(top), left: Math.round(left) }
}

function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect()

    // (2)
    var body = document.body
    var docElem = document.documentElement

    // (3)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

    // (4)
    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0

    // (5)
    var top = box.top + scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft

    return { top: Math.round(top), left: Math.round(left) }
}

function getOffsetSum(elem) {
    var top = 0, left = 0;
    while (elem) {
        top = top + parseFloat(elem.offsetTop)
        left = left + parseFloat(elem.offsetLeft)
        elem = elem.offsetParent;
    }

    return { top: Math.round(top), left: Math.round(left) }
}

//watcher
if (!Object.prototype.watch) {
    Object.defineProperty(
        Object.prototype,
        "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop, handler) {
                var old = this[prop];
                var cur = old;
                var getter = function () {
                    return cur;
                };
                var setter = function (val) {
                    old = cur;
                    cur =
                        handler.call(this, prop, old, val);
                    return cur;
                };
            }
        });
}

function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

//NOT_USED
/*function registerId(id) {
    var res = Identificators.indexOf(id);
    if (res != -1) {
        console.error('Can\'t be register');
        return false;
    }
    Identificators.push(id);

    console.info('Registered');
    return true;
}

function checkFreeId(id) {    
    var res = Identificators.indexOf(id);
    if (res == -1) return true;
    return false;
}


function removeId(fromDom, id) {
    Identificators.splice(Identificators.indexOf(id), 1);
}*/
