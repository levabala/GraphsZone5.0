self.onmessage = function (e) {
    var files = e.data.files;
    var mode = e.data.mode;
    var buffers = [];

    // Read each file synchronously as an ArrayBuffer and
    // stash it in a global array to return to the main app.
    [].forEach.call(files, function (file) {
        var reader = new FileReaderSync();
        switch(mode){
            case 'ArrayBuffer': {
                buffers.push(reader.readAsArrayBuffer(file));
                break;
            }
            case 'String': {
                buffers.push(reader.readAsText(file));
                break;
            }
        }
    });

    postMessage(buffers);
};