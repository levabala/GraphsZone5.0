function GraphVis(id, field, domId) {
    var grv = this;
    Graph.apply(this, arguments);

    // Create and populate a data table.
    var data = new vis.DataSet();
    // create some nice looking data with sin/cos
    var counter = 0;
    var steps = 50;  // number of datapoints will be steps*steps
    var axisMax = 314;
    var axisStep = axisMax / steps;
    for (var x = 0; x < axisMax; x += axisStep) {
        for (var y = 0; y < axisMax; y += axisStep) {
            var value = (Math.sin(x / 50) * Math.cos(y / 50) * 50 + 50);
            data.add({ id: counter++, x: x, y: y, z: value, style: value });
        }
    }

    // specify options
    var options = {
        width: this.dom.width + 'px',
        height: this.dom.height + 'px',
        style: 'surface',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5
    };

    // Instantiate our graph object.
    var container = this.dom;
    var graph3d = new vis.Graph3d(container, data, options);
    var graphDom = this.dom.firstChild;

    graph3d.setCameraPosition({
        horizontal: 1.0,
        vertical: 0.5,
        distance: 1.7
    });

    this.dom.insertBefore(this.mb,this.dom.firstChild);

    console.log(graph3d)

    this.plot = graphDom;
    this.blockDragging();

    this.dom.onchange = function () {        
        graph3d.setSize(grv.dom.width, grv.dom.height);
        graphDom.style.width = grv.dom.width + 'px';
        graphDom.style.height = grv.dom.height + 'px';
        graph3d.redraw();        
    };
}