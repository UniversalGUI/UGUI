


var executable = "pngquant";
var cmdSwitches = "";

$( document ).ready( function(){
    //$("#compress").click( function( event ){
    //
    //    event.preventDefault();
    //
    //    var force = $( "#force" ).prop( "checked" );
    //    if ( force == true ) {
    //        var switch = " --force";
    //    }else{
    //      var switch = "";
    //    }
    //    var filepath = $('#DropZone input[type=file]').val();
    //    var filename = $('#DropZone input[type=file]').val().split('\\').pop();
    //
    //  $("#commandLine").html( executable + switch + " " + filepath );
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

        //CHECKBOXES

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

        //ANYTHING OTHER THAN A CHECKBOX

            //Check if element contains prefix AND suffix
            } else if ( argPrefix && argSuffix ) {
                //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch40 = "-m 'message'"
                window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = argPrefix + $(cmdArgs[index]).val() + argSuffix;
                console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " has prefix and suffix" );
            //Check if element contains just a prefix
            } else if ( argPrefix ) {
                //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch4 = "--speed 1"
                window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = argPrefix + $(cmdArgs[index]).val();
                console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " has prefix only" );
            //Check if element contains just a suffix
            } else if ( argSuffix ) {
                //creates a variable named cmdSwitch# and sets it to the switch value, so cmdSwitch38 = "12 px"
                window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val() + argSuffix;
                console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " has suffix only" );
            //Check if it doesn't contain a prefix OR a suffix
            } else if {
                //creates a variable named cmdSwitch# and sets it to the switch value, cmdSwitch12 = "--silent"
                window["cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder")] = $(cmdArgs[index]).val();
                console.log( "cmdSwitch" + $(cmdArgs[index]).attr("data-argOrder") + " no prefix or suffix" );
        };

        //1. Create an array of all cmdSwitch#'s        [cmdSwitch99, cmdSwitch21, cmdSwitch1, cmdSwitch2, cmdSwitch3, cmdSwitch4, cmdSwitch40]
        //2. Order them ascending based on number value [cmdSwitch1, cmdSwitch2, cmdSwitch3, cmdSwitch4, cmdSwitch21, cmdSwitch40, cmdSwitch99]
        //3. Combine them into one var. var cmdSwitches = cmdSwitch1 + cmdSwitch2 + cmdSwitch3 + cmdSwitch4 + cmdSwitch21 + cmdSwitch40 + cmdSwitch99;
        //4. For now, output to a box on the page. $("#commandLine").html( executable + cmdSwitches );
        //5. Should read: pngquant --force --nofs --iebug --speed 1 auto -m "user message" c:\file.png

    });

});