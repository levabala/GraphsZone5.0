self.onmessage = function (e) {
    /*
        e.data = {
            type: (stringXYZ | list_moda | byte),
            data: (data)
        }
    */
    var obj = {
        x: [],
        y: [],
        z: []
    };
    var keys = ['x','y','z'];
    var buffer = '';
    var sum = 0;    
    var index = 0;
    console.log(e.data);
    for (var d = 0; d < 100/*e.data.data[0].length*/; d++){
        val = e.data.data[0][d];
        buffer += val;   
                                 
    }
    console.log(val2);
    console.log(obj);    
    /*switch (e.data.type) {
        case 'stringXYZ': {
            var index = 0;
            var val = '';
            var buffer = '';
            for (var f in e.data.data){                                
                for (var s in e.data.data[f]) {                    
                    val = e.data.data[s];
                    if (val == ' '){
                        index++;
                        switch (index){
                            case 1:{
                                obj.x.push(parseFloat(buffer));
                                break;
                            }
                            case 2:{
                                obj.y.push(parseFloat(buffer));
                                break;
                            }
                            case 3:{
                                obj.z.push(parseFloat(buffer));
                                index = 0; 
                                break;
                            }
                        }
                    }
                    else buffer += val;                                                            
                }                
            }            
            break;
        }
    }*/
};