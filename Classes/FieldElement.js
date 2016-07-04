function FieldElement(id, parent, domId) {
    //check the ids for unquie    
    //if (!registerId(domId) && domId) return false;
    //------------------    
    var fEl = this;

    this._id = id;
    this.width = 200;
    this.height = 100;
    this.children = {};
    this.dom = document.createElement('div');
    this.dom.className = 'fieldElement';
    this.dom.style.width = this.width + 'px';
    this.dom.style.height = this.height + 'px';
    this.dom.dragging = false;
    this.parent = parent;
    if (domId) this.dom.id = domId;
    this.connectingStarted = false;

    this.type = 'FieldElement';

    this.title = document.createElement('input');
    this.title.className = 'title';
    this.title.value = domId;
    this.title.onchanged = function () {
        //here can be a dependence between title and id
    };    

    this.inputs = {};
    this.outputs = {};
    this.dataOut = {};
    this.dataIn = {};
    this.requiredFiles = [];
    this.cachedFiles = {};

    //listening for dropping
    this.dom.addEventListener('elemdrop', function (event) {
        console.log(event);
        if (fEl.appendElement(event.detail.type))
            event.detail.dom.parentNode.removeChild(event.detail.dom);
    });
    //-----        
    parent.dom.appendChild(this.dom);

    this.setSize = function (w, h) {
        fEl.width = w;
        fEl.height = h;
        fEl.dom.style.width = w + 'px';
        fEl.dom.style.height = h + 'px';
        fEl.dom.width = w;
        fEl.dom.height = h;

        fEl.dom.dispatchEvent(new Event('change'));
    };

    this.connectFrom = function (fr) {
        this.inputs[fr._id] = fr;

        this.connectingStarted = false;
        this.dom.style.background = 'rgba(255,255,255,0.8)';
        parent.dom.removeEventListener('tryToConnect', this.connecting, true);
        return true;
    };

    this.connectTo = function (to) {
        if (this._id != to._id && !this.outputs[to._id] && !this.inputs[to._id] && to.connectFrom(this)) {
            this.outputs[to._id] = to;
            console.log('succConnect', [fEl._id, to._id]);
            var SuccessfulConnectEvent = new CustomEvent('succConnect', { 'detail': [fEl, to] });
            parent.dom.dispatchEvent(SuccessfulConnectEvent);

            this.connectingStarted = false;
            this.dom.style.background = 'rgba(255,255,255,0.8)';
            parent.dom.removeEventListener('tryToConnect', this.connecting, true);
            return true;
        }
        console.warn('Fail to connect!');
        return false;
    };

    this.dom.onclick = function (e) {
        if (e.ctrlKey) {
            if (fEl.connectingStarted) {
                fEl.connectingStarted = false;
                fEl.dom.style.background = 'rgba(255,255,255,0.8)';
                parent.dom.removeEventListener('tryToConnect', fEl.connecting, true);
            }
            else {
                fEl.connectingStarted = true;
                fEl.dom.style.background = 'rgba(255,0,0,0.1)';

                var wantToConnectEvent = new CustomEvent('tryToConnect', { 'detail': fEl });
                fEl.dom.dispatchEvent(wantToConnectEvent);
                parent.dom.addEventListener('tryToConnect', fEl.connecting, true);
            }
        }
        e.stopPropagation();
    };

    document.addEventListener('keydown', function (e) {
        if (!fEl.connectingStarted) return;
        switch (e.which) {
            case 46: {
                fEl.delete();
            }
        }
    });

    this.connecting = function (e) {
        fEl.connectTo(e.detail);
    };

    this.appendElement = function () {

    };

    this.delete = function () {
        parent.dom.removeEventListener('tryToConnect', fEl.connecting, true);
        presenter.delete(this._id);
    };

    this.sendData = function () {
        for (var o in this.outputs) {
            console.log('sendTo', o);
            this.outputs[o].receiveData(this.dataOut);
        }
    };

    this.receiveData = function (data) {
        console.log('ondata:', data);
        this.dataIn = data;
    };

    this.dom.ondragenter = function (event) {
        fEl.dom.style.background = '#e6ffe6';
        event.stopPropagation();
        event.preventDefault();
    };

    this.dom.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        fEl.dom.style.background = 'white';

        // Check for the various File API support.
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            alert('The File APIs are not fully supported in this browser.');
            return;
        }

        console.log(event);
        fEl.requiredFiles = event.dataTransfer.files;
        fEl.uploadFiles();
    };

    this.dom.ondragleave = function (event) {
        fEl.dom.style.background = 'white';

        event.stopPropagation();
        event.preventDefault();
    };

    this.dom.ondragover = function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    this.uploadFiles = function(){
        FileUploader.addEventListener('message', fEl.cacheFiles);
        FileUploader.onerror = function(err){console.log(err);};
        FileUploader.postMessage({
            files: this.requiredFiles,
            mode: 'ArrayBuffer'
        });                
    };

    this.afterUpload = function(){

    }; 

    this.cacheFiles = function(e){                
        for (var f in e.data) fEl.cachedFiles[f] = e.data[f];
        FileUploader.removeEventListener('message', fEl.cacheFiles);
        fEl.afterUpload();
    };

    this.addTitle = function(){
        this.dom.insertBefore(this.title, this.dom.firstChild);
    };

    this.resizeEvent = function(){

    };

    /*this.dom.onmousedown = function(e){
        presenter.selected = fEl._id;
        fEl.dom.style.border = 'solid darkgreen 3px';
        e.stopPropagation();
    };*/
}