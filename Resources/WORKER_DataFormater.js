self.onmessage = function (e) {
    var res = [];
    //data.add({ id: counter++, x: x, y: y, z: value, style: value });

    var arrays = e.data.arrays;
    var roughness = e.data.roughness;
    var quality = (e.data.quality || 1);
    console.log(quality)
    var points = [];
    var index = 0;
    var normalWidth = (arrays.length > 500) ? arrays.length : 500;
    var coeffX = Math.floor(normalWidth / arrays.length);

    var lastZ = 0;
    var lastY = 0;
    var topB = 600;
    var bottomB = 80;
    var maxX = 0;
    var maxZ = 0;
    var cc = 0;
    var buff = 0;
    var buffX = [];
    var cx = 1;
    if (quality > 5) cx = Math.floor(quality/2);    
    for (var x = 0; x < arrays.length; x+= cx) {
        for (var y = 0; y < arrays[x].length; y++) {
            if (y > bottomB && y < topB && Math.abs(arrays[x][y] - lastZ) > roughness) {
                buff += arrays[x][y];
                cc++;
                if (cc >= quality) {
                    points.push({ id: index, x: parseInt(x) * coeffX, y: parseInt(y), z: buff / cc });
                    lastZ = arrays[x][y];
                    if (lastZ > maxZ) maxZ = lastZ;
                    //lastY = y;
                    index++;
                    cc = 0;
                    buff = 0;
                }
            }
        }
        maxX = x * coeffX;
    }
    postMessage({ points: points, coeffX: coeffX, maxX: maxX, maxY: topB - bottomB, maxZ: lastZ });
};