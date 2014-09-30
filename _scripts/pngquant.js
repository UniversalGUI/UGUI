


var executable = "pngquant";
var switches = "";

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

    //When you click the Compress button
    $("#compress").click( function( event ){

        //Prevent the form from sending like a normal website
        event.preventDefault();

        //Detect all elements in the form with data-argOrder
        var index;
        var cmdArgs = $("#argsForm").find("[data-argOrder]");

        //Get the values for each form item depending on the type of element it is
        for (index = 0; index < cmdArgs.length; ++index) {
            //Make this long thing shorter for cleaner code
            var argPrefix = $(cmdArgs[index]).attr("data-argPrefix");
            var argSuffix = $(cmdArgs[index]).attr("data-argSuffix");

            //Check if it is a checkbox
            if ( $( cmdArgs[index] ).is('input[type="checkbox"]') ) {
                //See if the checkbox is checked
                var thisCheckbox = $(cmdArgs[index]).prop( "checked" );
                if ( thisCheckbox == true ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch1 = "--force"
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val();
                    console.log("cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " checked");
                } else {
                    //if checkbox is not checked
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = "";
                    console.log("cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " not checked");
                }

            //Check if element contains prefix AND suffix
            } else if
                (
                    $(cmdArgs[index]).is('input[type="range"]') && argPrefix && argSuffix ||
                    $(cmdArgs[index]).is('input[type="file"]') && argPrefix && argSuffix ||
                    $(cmdArgs[index]).is('select') && argPrefix && argSuffix ||
                    $(cmdArgs[index]).is('textarea') && argPrefix && argSuffix
                ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch4 = "--speed 1"
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = argPrefix + $(cmdArgs[index]).val() + argSuffix;
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " has prefix and suffix" );
            //Check if element contains just a prefix
            } else if
                (
                    $(cmdArgs[index]).is('input[type="range"]') && argPrefix ||
                    $(cmdArgs[index]).is('input[type="file"]') && argPrefix ||
                    $(cmdArgs[index]).is('select') && argPrefix ||
                    $(cmdArgs[index]).is('textarea') && argPrefix
                ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch4 = "--speed 1"
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = argPrefix + $(cmdArgs[index]).val();
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " has prefix only" );
            //Check if element contains just a suffix
            } else if
                (
                    $(cmdArgs[index]).is('input[type="range"]') && argSuffix ||
                    $(cmdArgs[index]).is('input[type="file"]') && argSuffix ||
                    $(cmdArgs[index]).is('select') && argSuffix ||
                    $(cmdArgs[index]).is('textarea') && argSuffix
                ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch4 = "--speed 1"
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val() + argSuffix;
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " has suffix only" );
            //Check if it doesn't contain a prefix OR a suffix
            } else if
                (
                    $(cmdArgs[index]).is('input[type="file"]') ||
                    $(cmdArgs[index]).is('input[type="range"]') ||
                    $(cmdArgs[index]).is('select') ||
                    $(cmdArgs[index]).is('textarea')
                ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val();
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " no prefix or suffix" );

            //If the data-argOrder is used on an element that has not been specified above, attempt to grab a value
            } else if
                (
                    argPrefix && argSuffix
                ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch4 = "--speed 1"
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = argPrefix + $(cmdArgs[index]).val() + argSuffix;
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " unknown type, has prefix and suffix" );
            //Check if element contains just a prefix
            } else if
                (
                    argPrefix
                ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch4 = "--speed 1"
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = argPrefix + $(cmdArgs[index]).val();
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " unknown type, has prefix only" );
            //Check if element contains just a suffix
            } else if
                (
                    argSuffix
                ) {
                    //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch4 = "--speed 1"
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val() + argSuffix;
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " unknown type, has suffix only" );
            //Check if it doesn't contain a prefix OR a suffix
            } else {
                    //creates a variable named cmdSwitch# and attempts to get the value of the unknown element
                    window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val();
                    console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " unknown type, no prefix or suffix" );
            }
        };
    });

});