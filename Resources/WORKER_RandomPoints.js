self.onmessage = function(e){
    var arr = [{x:[],y:[],z:[],type: 'mesh3d'}];
    for (var i = 0; i < 100; i++) {            
            for (var ii = 0; ii < 100; ii++){
                arr[0].x.push(i);
                arr[0].y.push(ii);
                arr[0].z.push(i*ii+getRandomInt(-100,100));
            }            
    }
    postMessage(arr);
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}