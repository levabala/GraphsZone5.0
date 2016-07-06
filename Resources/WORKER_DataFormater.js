self.onmessage = function (e) {
    var res = [];
    //data.add({ id: counter++, x: x, y: y, z: value, style: value });

    var arrays = e.data.arrays;
    var roughness = e.data.roughness;
    var points = [];
    var index = 0;
    var normalWidth = 400;
    var coeffX = Math.floor(normalWidth / arrays.length);
    
    var lastZ = 0;
    var lastY = 0;
    var topB = 600;
    var bottomB = 80;
    var maxX = 0;
    var maxZ = 0;
    for (var x in arrays){
        for (var y in arrays[x]) {
            if (y > bottomB && y < topB && Math.abs(arrays[x][y]-lastZ) > roughness) {
                points.push({ id: index, x: parseInt(x) * coeffX, y: parseInt(y), z: arrays[x][y]});
                lastZ = arrays[x][y];
                if (lastZ > maxZ) maxZ = lastZ;               
                //lastY = y;
                index++;
            }   
                     
        }
        maxX = x*coeffX;            
    }    
    postMessage({points: points, coeffX: coeffX, maxX: maxX, maxY: topB-bottomB, maxZ: lastZ});
};