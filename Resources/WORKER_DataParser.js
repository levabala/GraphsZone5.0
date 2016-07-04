self.onmessage = function (e) {
    var res = [];
    var arrays = [];
    files = e.data;
    console.log(files);
    for (var f in files) {
        var arr = files[f];
        arrays[f] = [];
        var reader = new FileReaderSync();
        console.log(arr)
        var arr2 = new Uint8Array(arr);

        for (var a = 0; a < arr2.length; a += 4) {
            var b1 = arr2[a];
            var b2 = arr2[a + 1] << 8;
            var b3 = arr2[a + 2] << 16;
            var b4 = arr2[a + 3] << 24;
            if (typeof res[a / 4] === 'undefined') res[a / 4] = (b1 + b2 + b3 + b4);
            res[a / 4] += (b1 + b2 + b3 + b4);
            arrays[f].push((b1 + b2 + b3 + b4));
        }
    }
    
    postMessage({arrays: arrays, sum: res});
};