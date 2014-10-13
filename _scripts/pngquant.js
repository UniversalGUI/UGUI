String.prototype.hasWhiteSpace = function() {
    return /\s/g.test(this);
}

//Put your executable's name below without file extension.
var executable = "pngquant";
//cmdSwitches variable is meant to be blank here
var cmdSwitches = "";

$( document ).ready( function(){

    //  var filepath = $('#DropZone input[type=file]').val();
    //  var filename = $('#DropZone input[type=file]').val().split('\\').pop();
    //  $("#commandLine").html( executable + switch + " " + filepath );

    var cmdSwitches = [];

    ///////////////////////////////////////////////////////////////////////////
    //            What happenes when you click the submit button.            //
    ///////////////////////////////////////////////////////////////////////////
    // When the button is pressed, prevent it from submitting the form like  //
    // it normally would in a browser. Then grab all elements with an        //
    // argOrder except for unchecked checkboxes. Combine the prefix, value,  //
    // and suffix into one variable per element. Put them in the correct     //
    // order. Send out all of the prefix/value/suffix combos in the correct  //
    // order to the CLI executable.                                          //
    ///////////////////////////////////////////////////////////////////////////

    //When you click the Compress button.
    $("#sendCmdArgs").click( function( event ){


        //Prevent the form from sending like a normal website.
        event.preventDefault();
        //clear out the commandLine box every time sendCmdArgs is clicked.
        $("#commandLine").html(" ");

        //Create an object containing all elements with an argOrder.
        var cmdArgs = $('#argsForm *[data-argOrder]');
        var unsortedCmds = new Object(); //????????????????Does this need to be cleared after each click?
                                            //no, once execution leave this code blocks, all LOCAL variables are destroyed

        //If an element is an unchecked checkbox, it gets skipped.
        for (var index = 0; index < cmdArgs.length; index++) {
            var cmdArg = $(cmdArgs[index]);

            //skips extraction if checkbox not checked.
            if ( cmdArg.is(':checkbox') && !cmdArg.prop("checked") ) continue;

            //All elements other than unchecked checkboxes get ran through this function.
            extractSwitchString(cmdArg);
        }

        //Intentionally generic code used to sort objects
        function sortObject(obj) {
            var theSwitchArray = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    theSwitchArray.push({
                        'key': prop,
                        'value': obj[prop]
                    });
                }
            }
            theSwitchArray.sort(function(a, b) { return a.key - b.key; });
            //theSwitchArray.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
            return theSwitchArray; // returns array
        }

        function extractSwitchString(argumentElement) {

            //1. Create a variable based on the elements argPrefix data.
            var prefix = handleWhiteSpaces(argumentElement.data('argprefix'));

            //2. Create a variable based on the value of the element, if no value present log error.
            var value = handleWhiteSpaces(argumentElement.val());
            if (!value) throw "something terrible is wrong, value is null for argumentElement!";
            //3. Create a variable based on the elements argSuffix data.
            var suffix = handleWhiteSpaces(argumentElement.data('argsuffix'));

            //4. Create one variable containing all three of the above in the proper order and skipping Pre/Suf if not supplied.
            var theSwitchString = (prefix ? prefix + ' ' : '') + value + (suffix ? ' ' + suffix : '');

            //5. Create a variable with the numeral value of the order the arguments should be outputted in.
            var argOrder = argumentElement.data('argorder');

            //6. Create a variable called using the argOrder and setting it to the combined Pre/Val/Suf. Like so: cmdSwitch6 = "--speed 9mph";
            window['cmdSwitch' + argOrder] = theSwitchString;

            //7. Plug above variables in to the unsortedCmds object to be sorted later
            unsortedCmds[argOrder] = theSwitchString;
        }

        function handleWhiteSpaces(text) {
            if (!text) return;
            if (text.hasWhiteSpace()) {
                return "\"" + text + "\"";
            }
            return text;
        }

        //Create an array with the sorted content
        var theSwitchArray = sortObject(unsortedCmds);

        //Get the value of each element and send it to be outputted.
        for (var index = 0; index < theSwitchArray.length; index++) {
            outputCmd(theSwitchArray[index].value);
        }

        //Output the commands arguments in the correct order
        function outputCmd(cmdSwitch) {
            $("#commandLine").append(cmdSwitch + " ");
        }

        $("#commandLine").prepend(executable);

    });

    //1. Create an array of all cmdSwitch#'s        [cmdSwitch99, cmdSwitch21, cmdSwitch1, cmdSwitch2, cmdSwitch3, cmdSwitch4, cmdSwitch40]
    //2. Order them ascending based on number value [cmdSwitch1, cmdSwitch2, cmdSwitch3, cmdSwitch4, cmdSwitch21, cmdSwitch40, cmdSwitch99]
    //3. Combine them into one var. var cmdSwitches = cmdSwitch1 + cmdSwitch2 + cmdSwitch3 + cmdSwitch4 + cmdSwitch21 + cmdSwitch40 + cmdSwitch99;
    //4. For now, output to a box on the page. $("#commandLine").html( executable + cmdSwitches );
    //5. Should read: pngquant --force --nofs --iebug --speed 1 auto -m "user message" c:\file.png
});