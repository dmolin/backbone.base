var TestFramework = require('./TestFW');

global.TestFW = new TestFramework();

//this file will be at the top of the gentests. Hence, the before/after blocks here will apply to ALL tests
global.beforeEach(function(){

});

global.afterEach(function(){
    //console.log("Clearing stubs");
    global.TestFW.clear();
});