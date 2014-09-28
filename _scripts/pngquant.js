//var spawn = require('child_process').spawn,
//    ls    = spawn('node', ['--version']);

//ls.stdout.on('data', function (data) {
//  console.log( " " + data );
//});

//ls.stderr.on('data', function (data) {
//  console.log('stderr: ' + data);
//});

//$("#taco").click(function(){
//  runcmd("pngquant", ["--force", "file.png"]);
//});

//runcmd("node", ["--version"], function(data){
//  $("#cow").html( "<pre>Node Version: " + data + "</pre>" );
//});

var executable = "pngquant";
var force = "";
var file = "";

$( document ).ready( function(){
    //$("#compress").click( function( event ){
    //
    //    event.preventDefault();
    //
    //    var force = $( "#force" ).prop( "checked" );
    //    if ( force == true ) {
    //        var string = " --force";
    //    }else{
    //      var string = "";
    //    }
    //    var filepath = $('#DropZone input[type=file]').val();
    //    var filename = $('#DropZone input[type=file]').val().split('\\').pop();
    //
    //  $("#commandLine").html( executable + string + " " + filepath );
    //
    //});

    $("#compress").click( function( event ){

        event.preventDefault();

        var index;
        var cmdArgs = $("#argsForm").find("[data-argOrder]");

        for (index = 0; index < cmdArgs.length; ++index) {
            if ( $( cmdArgs[index] ).is('input[type="checkbox"]') ) {
                var thisCheckbox = $(cmdArgs[index]).prop( "checked" );
                if ( thisCheckbox == true ) {
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val();
                    console.log("cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " winning!");
                }else{
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = "";
                    console.log("cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " failed");
                }
            } else if ( $(cmdArgs[index]).is("textarea") ) {
                console.log("I'm an textare!");
            } else if ( $(cmdArgs[index]).is("select")){
                console.log("I'm an dropdown!");
            } else {
                console.log("Not a checkbox or dropdown");
            }
        };
    });

});