function FieldElement(id, field, domId) {
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
    if (domId) this.dom.id = domId;
    this.connectingStarted = false;

    this.type = 'FieldElement';

    this.title = document.createElement('input');
    this.title.className = 'title';
    this.title.value = domId; 
    this.title.onchanged = function(){
        //here can be a dependence between title and id
    };

    this.dom.insertBefore(this.title,this.dom.firstChild);    

    this.inputs = {};
    this.outputs = {};
    this.dataOut = {};
    this.dataIn = {};

    //listening for dropping
    this.dom.addEventListener('elemdrop',function(event){
        console.log(event)
        if (fEl.appendElement(event.detail.type))
            event.detail.dom.parentNode.removeChild(event.detail.dom);
    });
    //-----

    field.appendChild(this.dom);

    this.setSize = function (w, h) {
        fEl.width = w;
        fEl.height = h;
        fEl.dom.style.width = w + 'px';
        fEl.dom.style.height = h + 'px';
    };

    this.connectFrom = function (fr) {        
        this.inputs[fr._id] = fr;

        this.connectingStarted = false;
        this.dom.style.background = 'rgba(255,255,255,0.8)';        
        field.removeEventListener('tryToConnect', this.connecting, true);
        return true;
    };

    this.connectTo = function (to) {                
        if (this._id != to._id && !this.outputs[to._id] && !this.inputs[to._id] && to.connectFrom(this)) {
            this.outputs[to._id] = to;
            console.log('succConnect',[fEl._id, to._id]);
            var SuccessfulConnectEvent = new CustomEvent('succConnect', { 'detail': [fEl, to] });
            field.dispatchEvent(SuccessfulConnectEvent);

            this.connectingStarted = false;
            this.dom.style.background = 'rgba(255,255,255,0.8)';            
            field.removeEventListener('tryToConnect', this.connecting, true);
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
                field.removeEventListener('tryToConnect', fEl.connecting, true);
            }
            else {                                
                fEl.connectingStarted = true;
                fEl.dom.style.background = 'rgba(255,0,0,0.1)';

                var wantToConnectEvent = new CustomEvent('tryToConnect', { 'detail': fEl });
                fEl.dom.dispatchEvent(wantToConnectEvent);
                field.addEventListener('tryToConnect', fEl.connecting, true);                
            }
        }
        e.stopPropagation();
    };

    this.connecting = function (e) {
        fEl.connectTo(e.detail);
    };

    this.appendElement = function (){

    };

    this.sendData = function(){
        for (var o in this.outputs){
            console.log('sendTo',o);
            this.outputs[o].receiveData(this.dataOut);
        }
    };

    this.receiveData = function(data){
        console.log('ondata:',data);
        this.dataIn = data;
    };
}