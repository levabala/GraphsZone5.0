function GraphVis(id, field, domId) {
    var grv = this;
    var coeffX = 1;
    Graph.apply(this, arguments);

    this.afterUpload = function () {
        console.clear();
        DataParser.postMessage(this.cachedFiles);
        DataParser.onmessage = function (e) {
            DataFormater.postMessage(e.data.arrays);
            DataFormater.onmessage = function (ee) {
                var data = new vis.DataSet();
                for (var v in ee.data.points) data.add(ee.data.points[v]);
                coeffX = ee.data.coeffX;
                grv.buildGraph(null, data, null);
            };
        };
        this.cachedFiles = [];
    };

    var toolBox = document.createElement('div');
    toolBox.className = 'toolBox';
    var snapshotBut = document.createElement('div');
    snapshotBut.className = 'button toolbutton';
    snapshotBut.innerHTML = 'SnapShot';
    var secondBut = document.createElement('div');
    secondBut.className = 'button toolbutton';
    secondBut.innerHTML = 'secondBut';
    var thirdBut = document.createElement('div');
    thirdBut.className = 'button toolbutton';
    thirdBut.innerHTML = 'thirdBut';
    var span = document.createElement('div');
    span.id = 'slider';
    span.style.position = 'relative';

    var perspectiveSwitch = createSwitcher();
    var pespOn = true;

    toolBox.appendChild(snapshotBut);
    toolBox.appendChild(perspectiveSwitch);
    toolBox.appendChild(document.createTextNode('Perspective'));
    //toolBox.appendChild(secondBut);
    //toolBox.appendChild(thirdBut);

    toolBox.appendChild(document.createElement('br'));
    toolBox.appendChild(document.createElement('br'));
    //toolBox.appendChild(document.createElement('br'));
    toolBox.appendChild(span);

    var bottomColor;

    span.onmousedown = function (e) {
        console.log('span1');
        e.stopPropagation();
    };

    this.buildGraph = function (axisesSize, d, pointsNumber) {
        var data;
        if (!d) {
            data = new vis.DataSet();
            var counter = 0;
            var steps = (pointsNumber || 50);  // number of datapoints will be steps*steps
            var axisMaxX = (axisesSize.x || 200);
            var axisMaxY = (axisesSize.y || 200);
            var axisStepX = axisMaxX / steps;
            var axisStepY = axisMaxY / steps;
            for (var x = 0; x < axisMaxX; x += axisStepX) {
                for (var y = 0; y < axisMaxY; y += axisStepY) {
                    var value = (Math.sin(x / 50) * Math.cos(y / 50) * 50 + 50);
                    data.add({ id: counter++, x: x, y: y, z: value, style: value });
                }
            }
        }
        else data = d;

        // specify options
        var options = {
            width: this.dom.width + 'px',
            height: this.dom.height + 'px',
            style: 'surface',
            showPerspective: true,
            showGrid: true,
            showShadow: false,
            keepAspectRatio: true,
            tooltip: true,
            dataColor: {
                strokeWidth: 0.001
            },
            xCenter: '50%',
            xValueLabel: function (x) {
                return (x / coeffX).toFixed(1);
            },
            legendLabel: 'label',
            xLabel: 'Number',
            yLabel: 'Channel',
            zLabel: 'Value',
            bottomColor: 240,
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

        graphDom.onmousedown = function (e) {
            console.log('mdown')
            presenter.selected = grv._id;
            grv.dom.style.border = 'solid darkgreen 3px';
            e.stopPropagation();
        };

        this.dom.insertBefore(this.mb, this.dom.firstChild);
        this.dom.appendChild(toolBox, this.dom.firstChild);

        this.plot = graphDom;
        this.blockDragging();

        this.dom.onchange = function () {
            graph3d.setSize(grv.dom.width, grv.dom.height);
            graphDom.style.width = grv.dom.width + 'px';
            graphDom.style.height = grv.dom.height + 'px';
            graph3d.redraw();
        };

        document.addEventListener('keydown', function (e) {
            if (presenter.selected != grv._id) return;
            var val;
            console.log(e.which)
            switch (e.which) {
                case 37: {
                    //left
                    val = parseInt(options.xCenter.replace('%')) - 1 + '%';
                    graph3d.setOptions({ xCenter: val });
                    options.xCenter = val;
                    break;
                }
                case 39: {
                    //right
                    val = parseInt(options.xCenter.replace('%')) + 1 + '%';
                    graph3d.setOptions({ xCenter: val });
                    options.xCenter = val;
                    break;
                }
                case 38: {
                    //top
                    val = options.verticalRatio + 0.05;
                    graph3d.setOptions({ verticalRatio: val });
                    options.verticalRatio = val;
                    break;
                }
                case 40: {
                    //bottom
                    val = options.verticalRatio - 0.05;
                    graph3d.setOptions({ verticalRatio: val });
                    options.verticalRatio = val;
                    break;
                }
            }
        });

        $(document).ready(function () {
            $(span).slider({
                value: 240,//Значение, которое будет выставлено слайдеру при загрузке
                min: 0,//Минимально возможное значение на ползунке
                max: 360,//Максимально возможное значение на ползунке
                step: 1,//Шаг, с которым будет двигаться ползунок
                create: function (event, ui) {
                    bottomColor = $(span).slider("value");//При создании слайдера, получаем его значение в перемен. val                
                },
                slide: function (event, ui) {
                    bottomColor = ui.value;
                    graph3d.setOptions({ bottomColor: bottomColor });
                    options.bottomColor = bottomColor;
                }
            });
        });

        perspectiveSwitch.firstChild.onclick = function () {
            console.log('click')
            if (pespOn) {
                graph3d.setOptions({ showPerspective: false });
                options.showPerspective = false;
                pespOn = false;
            }
            else {
                graph3d.setOptions({ showPerspective: true });
                options.showPerspective = true;
                pespOn = true;
            }
        };
    };

    this.buildGraph({ x: 200, y: 100 }, null, 10);
}

function createSwitcher() {
    var div = document.createElement('div');
    var input = document.createElement('input');
    var label = document.createElement('label');

    input.type = 'checkbox';
    label.className = 'switch';
    div.className = 'slider round';

    label.appendChild(input);
    label.appendChild(div);

    return label;
    /*
    <label class="switch">
        <input type="checkbox">
        <div class="slider round"></div>
    </label>
    */
}   