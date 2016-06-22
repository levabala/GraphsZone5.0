function Window(id,field,domId) {
    var win = this;

    //inheriting 
    FieldElement.apply(this, arguments);

    //main code    
    var counter = 0;    
    this.setSize(500, 300);
    this.connections = {};  
    this.type = 'Window';          
    //--------------------------------------
    //Listeners
    this.dom.onclick = null;
    this.dom.addEventListener('succConnect',function(e){
        win.connect(e.detail[0],e.detail[1]);
    });    

    //New elements
    this.appendElement = function (type) {
        var elem = presenter.createModule(type,this.dom, this._id + '_' + counter);        
        this.children[elem._id] = elem;
        counter++;

        return elem;
    };


    //About connecting
    this.connect = function (obj1, obj2) {        
        //check for existing                        
        if (typeof obj1 == 'undefined' || typeof obj2 == 'undefined') return false;

        var params = this.getLineParams(obj1, obj2);
        // make hr
        var line = "<div style='padding:0px; margin:0px; height:" + params.thickness + 
        "px; background-color:" + params.color + 
        "; line-height:1px; position:absolute; left:" + params.cx + 
        "px; top:" + params.cy + 
        "px; width:" + params.length + 
        "px; -moz-transform:rotate(" + params.angle + 
        "deg); -webkit-transform:rotate(" + params.angle + 
        "deg); -o-transform:rotate(" + params.angle + 
        "deg); -ms-transform:rotate(" + params.angle + 
        "deg); transform:rotate(" + params.angle + "deg);' />";

        var div = document.createElement('div');
        div.innerHTML = line;
        var element = div.firstChild;

        /*var circle1 = document.createElement('div');   //Тут лежит идея с кружком
        circle1.className = 'circle';
        circle1.style.left = params.pos1.x+'px';
        circle1.style.top = params.pos1.y+'px';*/


        this.dom.insertBefore(element, this.dom.firstChild);        
        //this.dom.insertBefore(circle1, this.dom.firstChild);
        if (!this.connections[obj1._id]) this.connections[obj1._id] = {};
        this.connections[obj1._id][obj2._id] = element;               
    };

    this.getLineParams = function (obj1, obj2) {
        var el1 = obj1.dom;
        var el2 = obj2.dom;

        var offset1 = getOffsetRect(el1);
        var offset2 = getOffsetRect(el2);        

        var bRect1 = el1.getBoundingClientRect();
        var bRect2 = el2.getBoundingClientRect();

        var size1 = getSize(el1);
        var size2 = getSize(el2);        

        var margin1 = getMargins(el1);
        var margin2 = getMargins(el2);        

        var thickness = 2;
        var color = 'red';    
        // bottom right        
        var x1 = offset1.left - margin1.left + size1.width/3 - (this.dom.getAttribute('data-x') || 0);//bRect1.left - (this.dom.getAttribute('data-x') || 0);
        var y1 = offset1.top - margin1.top - window.getComputedStyle(Field).top.replace('px','') - (this.dom.getAttribute('data-y') || 0);//bRect1.top - (this.dom.getAttribute('data-y') || 0);
        // top right
        var x2 = offset2.left - margin2.left + size2.width/3 - (this.dom.getAttribute('data-x') || 0);//bRect1.left - (this.dom.getAttribute('data-x') || 0);
        var y2 = offset2.top - margin2.top - window.getComputedStyle(Field).top.replace('px','') - (this.dom.getAttribute('data-y') || 0);//bRect1.top - (this.dom.getAttribute('data-y') || 0);
        //console.log(getElementPosition(el1));
        // distance
        var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        // center
        var cx = ((x1 + x2) / 2) - (length / 2);
        var cy = ((y1 + y2) / 2) - (thickness / 2);
        // angle
        var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

        return {
            thickness: thickness,
            color: color,
            cx: cx,
            cy: cy,
            length: length,
            angle: angle,
            pos1: new Pos(x1,y1),
            pos2: new Pos(x2,y2)
        };
    };

    this.refreshConnections = function () {                
        for (var c1 in win.connections) {
            for (var c2 in win.connections[c1]) {                
                win.dom.removeChild(win.connections[c1][c2]); //и так сойдёт))                       
                win.connect(win.children[c1], win.children[c2]);
            }
        }
    };

    this.init = function () {
        var target;
        console.log(this.children);
        for (var ch in this.children) {
            target = this.children[ch].dom,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + 1,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + 1;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
        target = this.dom,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + 1,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + 1;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
    };

    setInterval(this.refreshConnections, 10);
}