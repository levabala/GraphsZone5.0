function GraphPlotly(id, field, domId) {
    var gPl = this;
    FieldElement.apply(this, arguments);

    var testD = [
        {
            x: [],
            y: [],
            z: [],
            type: 'mesh3d'//surface
        }
    ];

    /*for (var i = 0; i < 10; i++) {
        testD[0].z[i] = [];
        for (var ii = 0; ii < 1000; ii++) {
            testD[0].z[i].push(getRandomInt(0, 100));
        }
    }*/

    /*for (var i = 0; i < 500; i++) {            
            for (var ii = 0; ii < 500; ii++){
                testD[0].x.push(i);
                testD[0].y.push(ii);
                testD[0].z.push(i*ii+getRandomInt(-100,100));
            }            
    }*/



    var layout = {
        margin: { t: 30, l: 30, r: 30, b: 30 },
        width: this.width,
        height: this.height,
        autosize: true,
        scene: {
            xaxis: {
                title: 'time',
                domain: [0, 0.15]
            },
            yaxis: {
                title: 'count'
            },
            zaxis: {
                title: 'temp'
            }
        },
        title: 'That\' only a PLOT!'
    };

    this.dom.innerHTML = '<h1>Rendering...</h1>';

    RandomPoints.postMessage('get');
    var getted = false;
    RandomPoints.onmessage = function (arr) {
        console.log('Rendered')
        gPl.dom.innerHTML = "";        
        Plotly.plot(gPl.dom, arr.data, layout);
        var plot = gPl.dom.getElementsByClassName('plot-container plotly')[0];
        getted = true;
        plot.onmousedown = function (event) {
            event.stopPropagation();
        };
    };

    var mb = document.createElement('moveButton');
    this.dom.appendChild(mb);



    mb.style.webkitTransform =
        mb.style.transform =
        'translate(' + 0 + 'px, ' + -30 + 'px)';

    this.dom.onchange = function () {
        layout.width = gPl.dom.width;
        layout.height = gPl.dom.height;
        if (getted) Plotly.relayout(gPl.dom, layout);
    };
}