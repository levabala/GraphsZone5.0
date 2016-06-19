// target elements with the "draggable" class
interact('.fieldElement')
    .draggable({
        inertia:false,
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: true,

        onmove: dragMoveListener,
        /*onend: function (event) {
          var textEl = event.target.querySelector('p');
    
          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(event.dx * event.dx +
                         event.dy * event.dy)|0) + 'px');
        }*/
    })
    .resizable({
        preserveAspectRatio: false,
        edges: { left: true, right: true, bottom: true, top: true }
    })
    .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        //target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);

        event.stopPropagation();
    });

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    
    event.stopPropagation();
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

interact('.fieldElement').dropzone({
  // only accept elements matching this CSS selector
  accept: '.fieldElement.unsetted',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    console.log('dropactive');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // feedback the possibility of a drop
    console.log('dragenter');
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    console.log('dropleave');
  },
  ondrop: function (event) {
    console.log('drop');
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    console.log('dropdeactivate');
  }
});

//---------------------------------------------------
//HOT KEYS
document.onkeypress = function (e) {    
    switch (e.keyCode) {
        case 1081:
        case 113: {
            toggleTheMenu();
            break;
        }
    }
};

function toggleTheMenu() {    
    $('#Tools').animate({ width: 'toggle' }, 350);
    if (!menuOn) {
        toggleBut.src = "CloseImage.png";
        toggleBut.width = 50;
        toggleBut.height = 45;
        menuOn = true;
    }
    else {
        toggleBut.src = "ToggleImage.png";
        menuOn = false;
    }
}

/*
//for scrollbar
jQuery(document).ready(function(){
    jQuery('.scrollbar-inner').scrollbar();
});*/