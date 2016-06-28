function Maquette(name,field){
    this._name = name;
    this.dom = document.createElement('div');
    this.dom.className = 'maquette';     

    field.dom.appendChild(this.dom);
    this.type = 'Maquette';

    this.setSize = function (w, h) {
        this.width = w;
        this.height = h;
        this.dom.style.width = w + 'px';
        this.dom.style.height = h + 'px';        
    };    
}