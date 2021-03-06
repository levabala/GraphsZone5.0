function GraphVis(id, field, domId) {
    var grv = this;
    var coeffX = 1;
    var quality = 10;
    var maindata;
    var camera = {};
    var opts = {};
    var axXmax = 0;
    var axYmax = 0;
    var axZmax = 0;
    var roughness = 0;
    var lastCache = [];
    var palette = [];
    Graph.apply(this, arguments);

    this.setSize(600, 400);

    this.afterUpload = function () {
        //console.clear();
        loadstart();
        DataParser.postMessage(this.cachedFiles);
        DataParser.onmessage = function (e) {
            console.log(roughness)
            DataFormater.postMessage({ arrays: e.data.arrays, roughness: roughness, quality: quality });
            DataFormater.onmessage = function (ee) {
                axXmax = ee.data.maxX;
                axYmax = ee.data.maxY;
                axZmax = ee.data.maxZ;
                var data = new vis.DataSet();
                for (var v in ee.data.points) data.add(ee.data.points[v]);
                coeffX = ee.data.coeffX;
                grv.buildGraph(null, data, null);
                loadend();
            };
        };
        lastCache = this.cachedFiles;
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
    span.onmouseup = function (e) {
        console.log('blur')
        span.firstChild.blur();
    };

    //C O L O R  P I C K E R    
    var cp = document.createElement('div');
    cp.className = 'colorpicker';
    cp.innerHTML = 'Color Picker';

    cp.ondragleave = function (event) {
        cp.style.background = 'lightcoral';

        event.stopPropagation();
        event.preventDefault();
    };

    cp.ondragover = function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    cp.ondragenter = function (event) {
        cp.style.background = '#e6ffe6';
        event.stopPropagation();
        event.preventDefault();
    };

    function loadstart() {
        cp.innerHTML = 'Loading...';
    }

    function loadend() {
        cp.innerHTML = 'Color Picker';
    }

    var perspectiveSwitch = createSwitcher();
    var pespOn = false;

    toolBox.appendChild(snapshotBut);
    toolBox.appendChild(perspectiveSwitch);
    toolBox.appendChild(cp);
    //toolBox.appendChild(secondBut);
    //toolBox.appendChild(thirdBut);

    //toolBox.appendChild(document.createElement('br'));
    //toolBox.appendChild(document.createElement('br'));
    //toolBox.appendChild(document.createElement('br'));
    toolBox.appendChild(span);

    var bottomColor;

    this.buildGraph = function (axisesSize, d, pointsNumber, maquette) {
        var data;
        if (!d) {
            if (!axisesSize) axisesSize = {};
            data = new vis.DataSet();
            var counter = 0;
            var steps = 5;//(pointsNumber || 5);  // number of datapoints will be steps*steps
            var axisMaxX = (axisesSize.x || 200);
            var axisMaxY = (axisesSize.y || 100);
            var axisStepX = axisMaxX / steps;
            var axisStepY = axisMaxY / steps;
            for (var x = 0; x < axisMaxX; x += axisStepX) {
                //console.log('c:', counter)
                //console.log('x:', x)
                if (x == axisStepX * 2) continue;
                for (var y = 0; y < axisMaxY; y += axisStepY) {
                    if (y == axisStepY * 3) {
                        //console.warn('S N A P')
                        continue;
                    }
                    var value = (Math.sin(x / 50) * Math.cos(y / 50) * 50 + 50);
                    data.add({ id: counter++, x: x, y: y, z: value, style: value });
                    //console.log({ x: x, y: y });
                }
            }
        }
        else data = d;

        // specify options
        var options;
        if (!opts.width)
            options = {
                width: this.dom.width + 'px',
                height: this.dom.height + 'px',
                style: 'surface',
                showPerspective: false,
                showGrid: true,
                showShadow: false,
                keepAspectRatio: true,
                tooltip: true,
                dataColor: {
                    strokeWidth: 0.001
                },
                xCenter: '50%',
                yCenter: '50%',
                yValueLabel: function (y) {
                    return Math.floor(y)//(y-3)/227.39);
                },
                xValueLabel: function (x) {
                    return Math.floor(15 + 2.25*x);
                },
                legendLabel: 'label',
                xLabel: 'Number(x)',
                scaleX: coeffX,
                yLabel: 'Channel(y)',
                zLabel: 'Value(z)',
                bottomColor: 240,
                verticalRatio: 0.5,
                palette: (palette.length > 0 ? palette : undefined)
            };
        else options = opts;        
        console.log('VERTICAL RATION:',options.verticalRatio)

        // Instantiate our graph object.
        var container = this.dom;
        var graph3d = new vis.Graph3d(container, data, options);
        var graphDom = this.dom.firstChild;

        if (!camera.distance)
            graph3d.setCameraPosition({
                horizontal: 5.1,//1.5697963267948967,
                vertical: 1.5707963267948966,
                distance: 1.7
            });
        else graph3d.setCameraPosition(camera);


        graphDom.firstChild.addEventListener('mousedown', function (e) {
            presenter.selected = grv._id;
            console.log(data.length)
            if (data.length > 1000) {
                camera = graph3d.getCameraPosition();
                var d = new vis.DataSet();
                console.log(axXmax, axYmax)
                if (!axXmax) axXmax = 200;
                if (!axYmax) axYmax = 100;
                if (!axZmax) axZmax = 10;
                d.add({ id: 0, x: 0, y: 0, z: 10 });
                d.add({ id: 1, x: axXmax, y: axYmax, z: axZmax });
                graph3d.setData(d);
                graph3d.redraw();
                document.onmouseup = function (e) {
                    presenter.selected = grv._id;
                    opt = options;
                    console.log('MOUSEUP', grv.cachedFiles)
                    if (grv.cachedFiles[0] !== null) {
                        graph3d.setData(data);
                    }
                    else {
                        grv.buildGraph(null, null, null);
                    }
                    document.onmouseup = null;
                };
            }
        });

        console.log('graphDom:', graphDom);

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
                    if (e.ctrlKey) {
                        val = options.verticalRatio + 0.05;
                        graph3d.setOptions({ verticalRatio: val });
                        options.verticalRatio = val;
                    }
                    else {
                        val = parseInt(options.yCenter.replace('%')) + 1 + '%';
                        graph3d.setOptions({ yCenter: val });
                        options.yCenter = val;
                    }
                    break;
                }
                case 40: {
                    //bottom
                    if (e.ctrlKey) {
                        val = options.verticalRatio - 0.05;
                        graph3d.setOptions({ verticalRatio: val });
                        options.verticalRatio = val;
                    }
                    else {
                        val = parseInt(options.yCenter.replace('%')) - 1 + '%';
                        graph3d.setOptions({ yCenter: val });
                        options.yCenter = val;
                    }
                    break;
                }
            }
            graph3d.setSize(grv.dom.width, grv.dom.height);
            graphDom.style.width = grv.dom.width + 'px';
            graphDom.style.height = grv.dom.height + 'px';
            graph3d.redraw();
        });

        $(document).ready(function () {
            $(span).slider({
                value: quality,//Значение, которое будет выставлено слайдеру при загрузке
                min: 0,//Минимально возможное значение на ползунке
                max: 10,//Максимально возможное значение на ползунке
                step: 1,//Шаг, с которым будет двигаться ползунок
                create: function (event, ui) {
                    quality = $(span).slider("value");//При создании слайдера, получаем его значение в перемен. val                
                },
                slide: function (event, ui) {
                    quality = ui.value;
                }
            });
        });

        cp.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
            cp.style.background = 'lightcoral';

            // Check for the various File API support.
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                alert('The File APIs are not fully supported in this browser.');
                return;
            }

            console.log(event);
            var reader = new FileReader();
            reader.onload = function (e) {
                console.log(e.target.result);
                var txt = e.target.result.split('\n');
                var pal = [];
                for (var t = 1; t < txt.length; t++) {
                    var arr = txt[t].split(' ');
                    if (arr.length < 3) continue;
                    pal[t - 1] = [];
                    var val = [];
                    for (var a in arr) {
                        var b = arr[a];
                        if (isNaN(parseFloat(b))) continue;
                        val.push(parseFloat(b));
                    }
                    pal[t - 1] = new rgb(val[1], val[2], val[3], val[0] / 100);
                }
                var p = [];
                palette = pal;
                console.log(palette)
                /*camera = graph3d.getCameraPosition();
                console.log(lastCache.length)
                if (lastCache.length === 0) return;
                grv.cachedFiles = lastCache;
                grv.afterUpload();*/
                graph3d.setOptions({ palette: palette });
                graph3d.setSize(grv.dom.width, grv.dom.height);
                graphDom.style.width = grv.dom.width + 'px';
                graphDom.style.height = grv.dom.height + 'px';
                graph3d.redraw(true);
            };
            console.log(event)
            var txt = reader.readAsText(event.dataTransfer.files[0]);
        };


        span.onmousedown = function (e) {
            console.log('span1');
            e.stopPropagation();
            opts = options;
            document.onmouseup = rebuild;
        };

        function rebuild() {
            camera = graph3d.getCameraPosition();
            if (lastCache.length === 0) return;
            grv.cachedFiles = lastCache;
            grv.afterUpload();
            document.onmouseup = null;
        }

        /*setInterval(function () {            
            graph3d.redraw();
        }, 1000);*/

        perspectiveSwitch.onmousemove = function () {
            console.log('mousemove')
        };

        perspectiveSwitch.onmousedown = function () {
            console.log('mousedown')
        };

        var sleep = true;
        perspectiveSwitch.onclick = function () {
            if (sleep) {
                sleep = false;
                return;
            }
            else sleep = true;

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

        snapshotBut.onclick = function (e) {
            domtoimage.toBlob(graphDom)
                .then(function (blob) {
                    window.saveAs(blob, 'GraphSnapshot.png');
                });
        };

        if (maquette) {
            triggerMouseEvent(graphDom.firstChild, 'mousedown');
            console.log('maq')
        }
    };

    this.buildGraph({ x: 200, y: 100 }, null, 10);
    //document.write('<div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked><label class="onoffswitch-label" for="myonoffswitch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>');    
}

var iindex = 0;
function createSwitcher() {
    var input = document.createElement('input');
    var label = document.createElement('label');
    var span1 = document.createElement('span');
    var span2 = document.createElement('span');

    input.type = 'checkbox';
    input.className = 'switch-input';
    input.checked = 'true';

    label.className = 'switch switch-yes-no';

    span1.className = 'switch-label';
    span1['data-on'] = 'yessss';
    span1['data-off'] = 'noo';
    console.log('span1:', span1)
    span2.className = 'switch-handle';

    /*
    var xmlString = '<label class="switch switch-yes-no"><input class="switch-input" type="checkbox" /><span class="switch-label" data-on="Yes" data-off="No"></span> <span class="switch-handle"></span> </label>';
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlString, "text/xml");
      

    var dd = doc.firstChild;*/

    /*document.innerHTML += ('<label class="switch switch-yes-no"><input class="switch-input" type="checkbox" /><span class="switch-label" data-off="PerspectiveOn" data-on="PerspectiveOff"></span> <span class="switch-handle"></span> </label>');
    var doc = document.body.lastChild;
    document.body.removeChild(doc);
    console.log('-asda-sda-sd-as-da-sd-as-d',doc)*/

    var doc = $.parseHTML('<label class="switch switch-yes-no"><input class="switch-input" type="checkbox" /><span class="switch-label" data-off="PerspectiveOn" data-on="PerspectiveOff"></span> <span class="switch-handle"></span> </label>')[0];
    console.log(doc)
    label.appendChild(input);
    label.appendChild(span1);
    label.appendChild(span2);

    return doc;//label;
    /*
    <label class="switch switch-yes-no">
	    <input class="switch-input" type="checkbox" />
	    <span class="switch-label" data-on="Yes" data-off="No"></span> 
	    <span class="switch-handle"></span> 
    </label>
    */
}   