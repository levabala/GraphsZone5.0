//var Identificators = [];

//Workplace
var Field = $('#Field')[0];

//Controller
var presenter = new Presenter('BIG BOSS');

//Test Window
var firstWindow = presenter.createModule('Window',Field,'win1'); 
var o1 = firstWindow.appendElement();
var o2 = firstWindow.appendElement();

//Creating manual connection
jsPlumb.ready(function(){
    firstWindow.connect(o1,o2);
});

//Connections painting
firstWindow.init();

//Modules Keeper
var mKeeper = new ModulesKeeper(0,$('#ModulesSection')[0],'mKeeper');