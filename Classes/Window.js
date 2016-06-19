function Window(id,field,domId) {
    var win = this;

    //inheriting 
    FieldElement.apply(this, arguments);

    //main code    
    var counter = 0;    
    this.setSize(500, 300);
    this.connections = {};            
    //--------------------------------------
    //Listeners
    this.dom.onclick = null;
    this.dom.addEventListener('succConnect',function(e){
        win.connect(e.detail[0],e.detail[1]);
    });

    //New elements
    this.appendElement = function () {
        var elem = new FieldElement(counter, this.dom, this._id + '_' + counter);
        this.children[counter] = elem;
        counter++;

        return counter - 1;
    };


    //About connecting
    this.connect = function (obj1, obj2) {        
        //check for existing
        if (!this.children[obj1].outputs[obj2] || !this.children[obj2].inputs[obj1]) return false;

        var params = this.getLineParams(obj1, obj2);
        // make hr
        var line = "<div style='padding:0px; margin:0px; height:" + params.thickness + "px; background-color:" + params.color + "; line-height:1px; position:absolute; left:" + params.cx + "px; top:" + params.cy + "px; width:" + params.length + "px; -moz-transform:rotate(" + params.angle + "deg); -webkit-transform:rotate(" + params.angle + "deg); -o-transform:rotate(" + params.angle + "deg); -ms-transform:rotate(" + params.angle + "deg); transform:rotate(" + params.angle + "deg);' />";

        var div = document.createElement('div');
        div.innerHTML = line;
        var element = div.firstChild;

        /*var circle1 = document.createElement('div');   //Тут лежит идея с кружком
        circle1.className = 'circle';
        circle1.style.left = params.pos1.x+'px';
        circle1.style.top = params.pos1.y+'px';*/


        this.dom.insertBefore(element, this.dom.firstChild);
        //this.dom.insertBefore(circle1, this.dom.firstChild);
        if (!this.connections[obj1]) this.connections[obj1] = {};
        this.connections[obj1][obj2] = element;
    };

    this.getLineParams = function (obj1, obj2) {
        var el1 = this.children[obj1].dom;
        var el2 = this.children[obj2].dom;
        var bRect1 = el1.getBoundingClientRect();
        var bRect2 = el2.getBoundingClientRect();

        var thickness = 2;
        var color = 'red';
        // bottom right
        var x1 = bRect1.left + bRect1.width / 4.7 - (this.dom.getAttribute('data-x') || 0);
        var y1 = bRect1.top - bRect1.height / 0.75 - (this.dom.getAttribute('data-y') || 0);
        // top right
        var x2 = bRect2.left + bRect2.width / 4.7 - (this.dom.getAttribute('data-x') || 0);
        var y2 = bRect2.top - bRect2.height / 0.75 - (this.dom.getAttribute('data-y') || 0);
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
                win.connect(c1, c2);
            }
        }
    };

    this.init = function () {
        var target;
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