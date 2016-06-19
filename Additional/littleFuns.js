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
