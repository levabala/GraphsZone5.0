function Data(id,field,domId){
    FieldElement.apply(this,arguments);

    this.setData = function(data) {
        this.dataOut = data;  
    };

    this.processData = function(){
        console.log('process');
    };

    
}