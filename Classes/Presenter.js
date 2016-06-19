function Presenter(name){
    this._name = name;
    this.elements = {};    
    this.availableModules = {
        'FieldElement': FieldElement,
        'Window': Window,
        'Maquette': Maquette
    };
    var counter = 0;

    this.createModule = function(m, field, name){        
        if (!this.availableModules[m]) return false;

        if (!field) field = Field; //default workplace                
        var module = new this.availableModules[m](counter,field,(name || ''));        
        console.log(m,'\n',module)
        counter++;
        return module;
    }; 
}