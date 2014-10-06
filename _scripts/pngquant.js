


var executable = "pngquant";
var cmdSwitches = "";

$( document ).ready( function(){

    //  var filepath = $('#DropZone input[type=file]').val();
    //  var filename = $('#DropZone input[type=file]').val().split('\\').pop();
    //  $("#commandLine").html( executable + switch + " " + filepath );

    //When you click the Compress button
    $("#compress").click( function( event ){

        event.preventDefault();

        $("#commandLine").html(" ");
        //Prevent the form from sending like a normal website

        var cmdArgs = $('#argsForm *[data-argOrder]');

        for (var index = 0; index < cmdArgs.length; index++) {
            var cmdArg = $(cmdArgs[index]);

            //skips extraction if checkbox not checked
            if ( cmdArg.is(':checkbox') && !cmdArg.prop("checked") ) continue;

            extractSwitchString(cmdArg);
        }

        function extractSwitchString(argumentElement) {
            var prefix = argumentElement.data('argprefix');

            var value = argumentElement.val();
            if (!value) throw "something terrible is wrong, value is null for argumentElement!";

            var suffix = argumentElement.data('argsuffix');

            var theSwitchString = (prefix ? prefix + '' : '') + value + (suffix ? '' + suffix : '');

            var argOrder = argumentElement.data('argorder');

            window['cmdSwitch' + argOrder] = theSwitchString;

            console.log( 'cmdSwitch' + argOrder + ': ' + theSwitchString );

            $("#commandLine").append(' ' + theSwitchString);
        }
    });

        // third checkbox is saying "on" instead of "--iebug"

        //1. Create an array of all cmdSwitch#'s        [cmdSwitch99, cmdSwitch21, cmdSwitch1, cmdSwitch2, cmdSwitch3, cmdSwitch4, cmdSwitch40]
        //2. Order them ascending based on number value [cmdSwitch1, cmdSwitch2, cmdSwitch3, cmdSwitch4, cmdSwitch21, cmdSwitch40, cmdSwitch99]
        //3. Combine them into one var. var cmdSwitches = cmdSwitch1 + cmdSwitch2 + cmdSwitch3 + cmdSwitch4 + cmdSwitch21 + cmdSwitch40 + cmdSwitch99;
        //4. For now, output to a box on the page. $("#commandLine").html( executable + cmdSwitches );
        //5. Should read: pngquant --force --nofs --iebug --speed 1 auto -m "user message" c:\file.png

});




