self.onmessage = function (e) {
    var res = [];
    //data.add({ id: counter++, x: x, y: y, z: value, style: value });

    var arrays = e.data;
    var points = [];
    var index = 0;
    var normalWidth = 400;
    var coeffX = normalWidth / arrays.length;
    
    var lastZ = 0;
    var lastY = 0;
    for (var x in arrays)
        for (var y in arrays[x]) {
            if (y > 80 && y < 600){// && Math.abs(arrays[x][y]-lastZ) > 10) {
                points.push({ id: index, x: parseInt(x) * coeffX, y: parseInt(y), z: arrays[x][y]});
                lastZ = arrays[x][y];
                //lastY = y;
            }
            index++;
        }    
    postMessage({points: points, coeffX: coeffX});
};