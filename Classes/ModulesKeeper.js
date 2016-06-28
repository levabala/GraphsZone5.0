function ModulesKeeper(id, field, domId) {
    var mk = this;
    //iheriting
    field = {dom: field}
    FieldElement.apply(this, arguments);
    this.type = 'ModulesKeeper';

    this.dom.className = 'mKeeper';
    this.dom.style.width = '100%';
    this.dom.style.height = 'auto';
    //this.dom.removeChild(this.title);    
    var counter = 0;

    this.refreshModulesList = function () {
        var even = false;
        this.dom.innerHTML = '';
        for (var i = 0; i < 3; i++)
            for (var m in presenter.availableModules) {
                if (m == 'Maquette') continue;
                var mod = this.newNormalMod(m);
                if (even) {
                    mod.dom.style.right = '40px';
                    even = false;
                }
                else even = true;
            }
    };

    this.newNormalMod = function (m) {
        var mod = presenter.createModule('Maquette', this.dom);        
        mod.setSize(180, 90);
        mod.dom.style.float = 'left';
        mod.dom.style.margin = '5px';
        mod.dom.style.padding = '5px';
        mod.dom.style.zIndex = '100';
        mod.dom.style.position = 'fixed';
        mod.dom.innerHTML = m;
        return mod;
    };

    this.refreshModulesList();
}