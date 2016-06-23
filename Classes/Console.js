function Console() {
    var c = this;
    var params = 'width=700,height=800';
    if (window.leftScreenBoundry) params =  'width=700,height=800,screenX=' + window.leftScreenBoundry() + ' , left=' + window.leftScreenBoundry();
    var consoleWin = window.open('', 'Console', params);
    var consoleHistory = ['help'];
    var consoleIndex = 1;
    var command = '';
    var doc;
    try {
        doc = consoleWin.document;
    }
    catch (err) {
        consoleWin.close();
        location.reload();
    }
    doc.title = 'Console';
    var body = doc.body;

    var logging = doc.createElement('div');
    logging.style = 'border: solid black 1px; width: 100%; height: 90%; font-family: "Courier New", Courier, monospace; font-size: 18px;overflow-y: scroll';
    var input = doc.createElement('input');
    input.style = 'width: 100%; margin-top: 10px; font-size: 25px; font-family: fantasy';
    input.onkeydown = function (e) {
        switch (e.which) {
            case 13: {
                getCommand(input.value);
                break;
            }
            case 40: {
                if (consoleIndex >= consoleHistory.length) return;
                consoleIndex++;
                input.value = (consoleHistory[consoleIndex] || ''); //костыль)
                window.setTimeout(function () {
                    moveCaretToEnd(input);
                }, 1);
                break;
            }
            case 38: {
                if (consoleIndex <= 0) return;
                consoleIndex--;
                input.value = consoleHistory[consoleIndex];
                window.setTimeout(function () {
                    moveCaretToEnd(input);
                }, 1);
                break;
            }
        }
    };

    body.insertBefore(input, body.firstChild);
    body.insertBefore(logging, body.firstChild);

    input.focus();

    var str;
    var funs = {
        help: function () {
            str = 'List of available commands:<br>';
            for (var f in funs) str += '  --- <i>' + f + '</i><br>';
            str += 'Also you can use <i>$&#60Your code&#62</i> to control the programm<br>To logging into $ use <i>cc.log()</i>';
            return str;
        },
        getObjects: function () {
            str = 'List of objects:<br>';
            for (var el in presenter.elements) str += el + ': ' + presenter.elements[el].type + ' | ID (in <i>mods</i>): <b>' + presenter.elements[el]._id + '</b> | Title: <b>' + presenter.elements[el].dom.id + '</b><br>';
            return str;
        },
        clear: function () {
            logging.innerHTML = '';
        },
        getManuals: function () {
            c.log(presenter.manuals);
        }
    };

    function getCommand(comm) {
        if (comm === '') return;

        command = comm;
        if (comm != consoleHistory[consoleHistory.length - 1]) {
            consoleHistory.push(comm);
            consoleIndex = consoleHistory.length;
        }
        if (comm[0] === '$') {
            comm = comm.replace('$', '');
            console.log(comm);
            try {
                globalEval(comm);
                console.info('OK');
            }
            catch (err) {
                console.warn(err);
                c.err(('ERROR:', err));
            }
        }
        else
            if (funs[comm]) {
                var answer = funs[comm]();
                c.log(answer);
            }
            else c.log('Unknown command');
        input.value = '';
        consoleIndex = consoleHistory.length;
    }

    this.log = function (txt) {
        if (typeof txt == 'object') txt = JSON.stringify(txt, null, 4);
        //txt = txt.replace(/<br><br>/g,'<br>&nbsp&nbsp&nbsp&nbsp');
        //txt = txt.replace(/<br><br>/g,'<br>&nbsp&nbsp&nbsp&nbsp');
        var p = doc.createElement('pre');
        p.innerHTML = '<b>***</b> ';
        p.innerHTML += '<i>' + command + '</i><br>';
        p.innerHTML += txt;
        logging.appendChild(p);
        logging.appendChild(doc.createElement('hr'));
        p.scrollIntoView();
    };

    this.err = function (err) {
        var p = doc.createElement('pre');
        p.innerHTML = '<b>***</b> ';
        p.innerHTML += '<i>' + command + '</i><br>';
        p.innerHTML += '<pre style=\'color: darkred; font-size: 20px\'>' + err + '<\pre>';
        logging.appendChild(p);
        logging.appendChild(doc.createElement('hr'));
        p.scrollIntoView();
    };

    /*
    var timer = setInterval(function () {
        if (consoleWin.closed) {
            clearInterval(timer);
            watcherWin.close();
        }
    }, 300);*/

    consoleWin.onbeforeunload = function (evt) {
        /*var message = "After closing the window all console history will be deleted";
        if (typeof evt == "undefined") {
            evt = consoleWin.event;
        }
        if (evt) {
            evt.returnValue = message;
        }        
        return message;*/
    }
}
