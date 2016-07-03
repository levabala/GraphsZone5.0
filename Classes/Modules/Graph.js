function Graph(id, field, domId) {
    var graph = this;
    FieldElement.apply(this, arguments);

    this.plot = null;

    this.mb = document.createElement('moveButton');          

    this.blockDragging = function(){
        graph.plot.onmousedown = function (event) {
            event.stopPropagation();
        };
    };

    this.dom.addEventListener('change', function () {                
        graph.mb.style.webkitTransform =
            graph.mb.style.transform =
            'translate(' + (graph.dom.width - 30) + 'px, ' + (graph.dom.height - 30) + 'px)';
    });
}