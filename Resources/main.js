//var Identificators = [];

//Workplace
var Field = $('#Field')[0];
Field.addEventListener('elemdrop',function(event){
    if (event.detail.type != 'Window') return;
    if (presenter.createModule(event.detail.type))
            event.detail.dom.parentNode.removeChild(event.detail.dom);
});

//Header
var Header = $('#Header')[0];

//Controller
var presenter = new Presenter('BIG BOSS');
var mods = presenter.elements; //short link

//Test Window 
var win1 = presenter.createModule('Window',{dom:Field},'win1'); 
var o1 = win1.appendElement('FieldElement');
var o2 = win1.appendElement('FieldElement');

o1.connectTo(o2);




//Creating manual connection
jsPlumb.ready(function(){
    //win1.connect(o1,o2);
});

//Connections painting
win1.init();

//Modules Keeper
var mKeeper = new ModulesKeeper(0,{dom:$('#ModulesSection')[0]},'mKeeper');

//Console
var cc = new Console();
console.log(cc);