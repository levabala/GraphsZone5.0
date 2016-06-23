function Presenter(name) {
    this._name = name;
    this.elements = {};
    this.availableModules = {
        'FieldElement': FieldElement,
        'Window': Window,
        'Maquette': Maquette
    };
    var counter = 0;

    this.manuals = {
        'Window': 'Special parent module to manage other child nodes<br><i>.connect(element1,element2)</i> - to create one-way connection<br><i>.appendElement(type)</i> - to append an element by a type (FieldElement,Window etc.)',
        'FieldElement': 'Basic module'
    };

    this.createModule = function (m, field, name) {
        if (!this.availableModules[m]) return false;

        if (!field) field = {dom:Field}; //default workplace                
        var module = new this.availableModules[m](counter, field, (name || ''));
        console.log(module._id + ": " + m + ' or ' + module.type);
        if (typeof module._id != 'undefined') {
            this.elements[module._id] = module;
        }
        counter++;
        return module;
    };

    this.delete = function (id) {
        var elem = this.elements[id];
        for (var o in elem.outputs)
            delete elem.outputs[o].inputs[id];
        for (var i in elem.inputs)
            delete elem.inputs[i].outputs[id];
        elem.parent.dom.removeChild(elem.dom);
        console.log(elem.parent)
        if (elem.parent.connections) elem.parent.deleteElement(id);
        delete this.elements[id];
        delete elem;
    };
}