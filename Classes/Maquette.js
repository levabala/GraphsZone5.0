function Maquette(name,field){
    this._name = name;
    this.dom = document.createElement('div');
    this.dom.className = 'fieldElement unsetted';     

    field.appendChild(this.dom);

    this.setSize = function (w, h) {
        this.width = w;
        this.height = h;
        this.dom.style.width = w + 'px';
        this.dom.style.height = h + 'px';
    };    
}