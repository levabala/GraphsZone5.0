function ModulesKeeper(id, field, domId) {
    var mk = this;
    //iheriting
    field = {dom: field}
    FieldElement.apply(this, arguments);
    this.type = 'ModulesKeeper';

    this.dom.className = 'mKeeper';
    this.dom.style.width = '100%';
    this.dom.style.height = 'auto';
    console.log('-----------',this.dom.parentNode.offsetWidth)
    //this.dom.removeChild(this.title);    
    var counter = 0;

    this.refreshModulesList = function () {        
        this.dom.innerHTML = '';
        /*for (var i = 0; i < 3; i++)
            for (var m in presenter.availableModules) {
                if (m == 'Maquette') continue;
                var mod = this.newNormalMod(m);                
            }*/
        var select = document.createElement('select');
        select.onchange = function(e){
            var mod = mk.newNormalMod(m);            
            triggerMouseEvent(mod.dom,'mousedown');
            triggerMouseEvent(mod.dom,'mousemove');
        };
        select.style.width = '90%';
        select.style.fontSize = '20px';
        for (var m in presenter.availableModules) {
                if (m == 'Maquette') continue;
                var opt = document.createElement('option');
                opt.innerHTML = m;
                select.appendChild(opt);
        }
        this.dom.appendChild(select);
    };

    this.dom.addEventListener('elemdrop', function (event) {
        event.stopPropagaton();
    });
    this.dom.addEventListener('dragenter', function (event) {
        event.stopPropagaton();
    });

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