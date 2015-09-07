
//Wait for the document to load before running ugui.js. Use either runUGUI or waitUGUI for immediate or delayed launch.
$(document).ready( runUGUI );







//Lets you open NW.js, then immediately launch the devtools, then a few seconds later run UGUI.
//Good for hitting a debugger in time, as often the JS runs before the devtools can open.
function waitUGUI() {
    require("nw.gui").Window.get().showDevTools();
    setTimeout(runUGUI, 6000);
}







//Container for all UGUI components
function runUGUI() {

var uguiVersion = "0.9.0";







/////////////////////////////////////////////////////////////////
//                      TABLE OF CONTENTS                      //
/////////////////////////////////////////////////////////////////
// Use CTRL+F to search for the match U## in the below file.   //
/////////////////////////////////////////////////////////////////
//                                                             //
// U01. UGUI variables                                         //
// U02. Read a file                                            //
// U03. Run CMD                                                //
// U04. Run CMD (classic)                                      //
// U05. Prevent user from entering quotes in forms             //
// U06. Submit is locked until required is fulfilled           //
// U07. Realtime updating of command output in UGUI Dev Tools  //
// U08. Clicking Submit                                        //
// U09. Building the command array                             //
// U10. Build UGUI Args object                                 //
// U11. Find key value                                         //
// U12. Parse argument                                         //
// U13. Process all <cmd> definitions                          //
// U14. Set input file path, file name, and extension          //
// U15. Color processor                                        //
// U16. Convert command array to string                        //
// U17. Replace HTML text with text from package.json          //
// U18. Update about modal                                     //
// U19. Navigation bar functionality                           //
// U20. Detect if in developer environment                     //
// U21. Put all executables in dropdowns                       //
// U22. Warn if identical data-argNames                        //
// U23. Put CLI help info in UGUI dev tools                    //
// U24. Swap bootswatches                                      //
// U25. Save chosen bootswatch                                 //
// U26. Custom keyboard shortcuts                              //
// U27. Launch links in default browser                        //
// U28. EZDZ: Drag and drop file browse box                    //
// U29. Range slider                                           //
// U30. Cut/copy/paste context menu                            //
// U31. The UGUI Object                                        //
//                                                             //
/////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////
//                                                         U01 //
//                        UGUI VARIABLES                       //
//                                                             //
/////////////////////////////////////////////////////////////////
// Listing of Variables used throughout this library.          //
/////////////////////////////////////////////////////////////////

//All arguments sent in the command
var allArgElements = $("cmd arg");

var index = 0;

//All executables
var executable = [];
for (index = 0; index < $("cmd").length; index++) {
    var currentCommandBlock = $("cmd")[index];
    executable.push($(currentCommandBlock).attr("executable"));
}

//Create the cmdArgs object containing all elements with an argOrder for each executable form.
//var cmdArgs = $("#argsForm *[data-argName]");
var argsForm = [];
for (index = 0; index < executable.length; index++) {
    argsForm.push( $("#" + executable[index] + " *[data-argName]" ) );
}

//Get all text fields where a quote could be entered
var textFields = $( "textarea[data-argName], input[data-argName][type=text]" ).toArray();

//Allow access to the filesystem
var fs = require("fs");

//Access the contents of the package.json file
var packageJSON = require("nw.gui").App.manifest;

//Name of the developer's application, set in package.json
var appName = packageJSON.name;

//Window Title, set in package.json
var appTitle = packageJSON.window.title;

//Version of the developer's application, set in package.json
var appVersion = packageJSON.version;

//Description or tagline for application, set in package.json
var appDescription = packageJSON.description;

//Name of the app developer or development team, set in package.json
var authorName = packageJSON.author;

//Name of the app developer or development team, set in package.json
var indexFile = packageJSON.main;

//Make sure the ugui and ugui.args objects exist, if not create them
if (!window.ugui) {
    window.ugui = {};
    window.ugui.args = {};
}







/////////////////////////////////////////////////////////////////
//                                                         U02 //
//                         READ A FILE                         //
//                                                             //
/////////////////////////////////////////////////////////////////
// A function that allows you to set the contents of a file to //
// a variable. Like so:                                        //
//                                                             //
// var devToolsHTML = readAFile("_markup/ugui-devtools.htm");  //
//                                                             //
/////////////////////////////////////////////////////////////////

function readAFile(filePathAndName) {
    //Validate that required argument is passed
    if (!filePathAndName) {
        console.info("Supply a path to the file you want to read as an argument to this function.");
        return;
    }
    //Validate types
    if (typeof(filePathAndName) !== "string") {
        console.info("File path must be passed as a string.");
        return;
    }
    var fileData = fs.readFileSync(filePathAndName, {encoding: "UTF-8"});
    return fileData;
}







/////////////////////////////////////////////////////////////////
//                                                         U03 //
//                           RUN CMD                           //
//                                                             //
/////////////////////////////////////////////////////////////////
// This is what makes running your CLI program and arguments   //
// easier. Cow & Taco examples below to make life simpler.     //
//                                                             //
// $("#taco").click( function() {                              //
//   runcmd('pngquant --force "file.png"');                    //
// });                                                         //
//                                                             //
// runcmd("node --version", function(data) {                   //
//   $("#cow").html("<pre>Node Version: " + data + "</pre>");  //
// });                                                         //
//                                                             //
/////////////////////////////////////////////////////////////////

function runcmd(executableAndArgs, callback) {
    //Validate that required argument is passed
    if (!executableAndArgs) {
        console.info("You must pass in a string containing the exectuable and arguments to be sent to the command line.");
        console.info('Example: ugui.helpers.runcmd("pngquant.exe --speed 11mph --force file.png");');
        return;
    }
    //Validate types
    if (typeof(executableAndArgs) !== "string") {
        console.info("Executable and arguments must be passed as a string.");
        return;
    }

    var exec = require("child_process").exec;
    var child = exec( executableAndArgs,
        //Throw errors and information into console
        function(error, stdout, stderr) {
            console.log(executableAndArgs);
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
            if (error !== null) {
                console.log("Executable Error: " + error);
            }
            console.log("---------------------");
        }
    );
    //Return data from command line
    child.stdout.on("data", function(chunk) {
        if (typeof callback === "function") {
            callback(chunk);
        }
    });
}







/////////////////////////////////////////////////////////////////
//                                                         U04 //
//                       RUN CMD CLASSIC                       //
//                                                             //
/////////////////////////////////////////////////////////////////
// This is the older way of running commands using "spawn".    //
// Cow & Taco examples below to make life simpler.             //
//                                                             //
// $("#taco").click( function() {                              //
//   runcmdClassic("pngquant", ["--force", "file.png"]);       //
// });                                                         //
//                                                             //
// runcmdClassic("node", ["--version"], function(data) {       //
//   $("#cow").html("<pre>Node Version: " + data + "</pre>");  //
// });                                                         //
//                                                             //
/////////////////////////////////////////////////////////////////

function runcmdClassic(executable, args, callback) {
    //Validate that both required arguments are passed
    if (!executable || !args) {
        console.info("You must pass in your executable as a string and your arguments as an array of strings to use this function.");
        console.info('Example: ugui.helpers.runcmd("pngquant.exe", ["--speed 11mph", "--force", "file.png"]);');
        return;
    }
    //Validate types
    if (typeof(executable) !== "string") {
        console.info("Executable must be passed as a string.");
        return;
    } else if (Object.prototype.toString.call(args) !== "[object Array]") {
        console.info("Arguments must be passed as strings in an array.");
        return;
    }
    //Validate that all items of the array are strings
    for (i = 0; i < args.length; i++) {
        if (typeof(args[i]) !== "string") {
            console.info("Arguments must be passed as strings in an array.");
            return;
        }
    }

   var spawn = require("child_process").spawn;
   console.log( executable, args );
   var child = spawn( executable, args );
   child.stdout.on("data", function(chunk) {
       if (typeof callback === "function") {
           callback(chunk);
       }
   });

   child.stderr.on("data", function(data) {
     console.log("stderr: " + data);
   });
}







/////////////////////////////////////////////////////////////////
//                                                         U05 //
//          PREVENT USER FROM ENTERING QUOTES IN FORMS         //
//                                                             //
/////////////////////////////////////////////////////////////////
// In all input text fields and textareas, remove both single  //
// and double quotes as they are typed, on page load, and when //
// the form is submitted.                                      //
/////////////////////////////////////////////////////////////////

//Remove all quotes on every textfield whenever typing or leaving the field
$(textFields).keyup( removeTypedQuotes );
$(textFields).blur( removeTypedQuotes );

function removeTypedQuotes() {
    //Loop through all text fields on the page
    for (index = 0; index < textFields.length; index++) {
        //User entered text of current text field
        var textFieldValue = $( textFields[index] ).val();
        //If the current text field has a double or single quote in it
        if ( textFieldValue.indexOf('"') != -1 || textFieldValue.indexOf("'") != -1 ) {
            //Remove quotes in current text field
            $( textFields[index] ).val( $( textFields[index] ).val().replace(/['"]/g, '') );
        }
    }
}

removeTypedQuotes();







/////////////////////////////////////////////////////////////////
//                                                         U06 //
//            SUBMIT LOCKED UNTIL REQUIRED FULFILLED           //
//                                                             //
/////////////////////////////////////////////////////////////////
// Gray out the submit button until all required elements are  //
// filled out.                                                 //
/////////////////////////////////////////////////////////////////

function unlockSubmit() {
    //Find the id name for the form containing what triggered this function (id=executable name)
    var whichExecutable = $(this).closest("form").attr("id");
    var formClicked = "";

    //cycle through all the executables in case they're using more than one.
    for (index = 0; index < executable.length; index++) {
        //if the form arg executable matches the cmd arg excutable
        if (whichExecutable === executable[index]) {
            //Set all the data-argNames for the correct form to formClicked
            formClicked = argsForm[index];
        }
    }

    //Check if any of the required elements aren't filled out
    for (index = 0; index < formClicked.length; index++) {
        var cmdArg = $(formClicked[index]);
        //If a required element wasn't filled out, make the submit button gray
        if ( cmdArg.is(":invalid") ) {
            $("#" + whichExecutable + " .sendCmdArgs").prop("disabled",true);
            return;
        }
    }

    //If all the required elements are filled out, enable the submit button
    $("#" + whichExecutable + " .sendCmdArgs").prop("disabled",false);
}

for (index = 0; index < argsForm.length; index++) {
    //When you click out of a form element
    $(argsForm[index]).keyup  ( unlockSubmit );
    $(argsForm[index]).mouseup( unlockSubmit );
    $(argsForm[index]).change ( unlockSubmit );
}

//On page load have this run once to unlock submit if nothing is required.
$(".sendCmdArgs").each( unlockSubmit );







/////////////////////////////////////////////////////////////////
//                                                         U07 //
//          REALTIME UPDATING DEV TOOL COMMAND OUTPUT          //
//                                                             //
/////////////////////////////////////////////////////////////////
// In the UGUI Dev Tools there is a CMD Output tab. This       //
// section updates the contents of that section whenever the   //
// developer interacts with any form elements rather than only //
// updating it on submit.                                      //
/////////////////////////////////////////////////////////////////

//Make sure we're in dev mode first
if( $("body").hasClass("dev") ) {

    for (index = 0; index < executable.length; index++) {
        //If any of the form elements with a data-argName change
        $(argsForm[index]).change( function() {
            //check if it was the drag/drop input box
            if ( $(this).parent().hasClass("ezdz") ) {
                var file = this.files[0];
                //run a custom function before updating dev tools
                ezdz(file);
                //now that the variables have been set by the above function
                updateUGUIDevCommandLine();
            } else {
                //otherwise just go ahead and update the dev tools
                updateUGUIDevCommandLine();
            }
        });
    }

    //If the user types anything in a form
    $(textFields).keyup( updateUGUIDevCommandLine );
    $(textFields).blur( updateUGUIDevCommandLine );
    $(".slider").on( "slide", updateUGUIDevCommandLine );
} else {
    //If we're not in Dev mode, make sure the ezdz can still run
    $(".ezdz input").change( function() {
        var file = this.files[0];
        //run a custom function before updating dev tools
        ezdz(file);
    });
}

function updateUGUIDevCommandLine() {
    //clear it out first
    $("#commandLine").empty();

    //Get the executable from the dropdown lists
    var pickedExecutable = $(".uguiCommand .executableName").val();

    //Get an array of all the commands being sent out
    var devCommandOutput = buildCommandArray(pickedExecutable);
    var devCommandOutputSpaces = [];

    for (var index = 0; index < devCommandOutput.length; index++) {
        if (devCommandOutput[index] !== "") {
            devCommandOutputSpaces.push(" " + devCommandOutput[index]);
        }
    }

    //Replace the text in the command line box in UGUI dev tools
    $("#commandLine").html( devCommandOutputSpaces );

}







/////////////////////////////////////////////////////////////////
//                                                         U08 //
//                       CLICKING SUBMIT                       //
//                                                             //
/////////////////////////////////////////////////////////////////
// What happens when you click the submit button.              //
/////////////////////////////////////////////////////////////////
// When the button is pressed, prevent it from submitting the  //
// form like it normally would in a browser. Then grab all     //
// elements with an argOrder except for unchecked checkboxes.  //
// Combine the prefix, value and suffix into one variable per  //
// element. Put them in the correct order. Send out all of the //
// prefix/value/suffix combos in the correct order to the CLI  //
// executable.                                                 //
/////////////////////////////////////////////////////////////////

//When you click the submit button.
$(".sendCmdArgs").click( function(event) {

    //Prevent the form from sending like a normal website.
    event.preventDefault();

    //Get the correct executable to use based on the form you clicked on
    var thisExecutable = $(this).closest("form").attr("id");

    //Remove all single/double quotes from any text fields
    removeTypedQuotes();

    //Build the command line array with the executable and all commands
    var builtCommandArray = buildCommandArray(thisExecutable);

    //Convert the array to a string that can be ran in a command line using the runcmd function
    var builtCommandString = convertCommandArraytoString(builtCommandArray);

    //Check if the form has an element with a class of returnedCmdText
    if ( $("#" + thisExecutable + " .returnedCmdText").length > 0 ) {
        //If so, run a command and put its returned text on the page
        runcmd( builtCommandString, function(data) {
            $("#" + thisExecutable + " .returnedCmdText").html(data);
        });
    } else {
        //Run the command!
        runcmd(builtCommandString);
    }


});







/////////////////////////////////////////////////////////////////
//                                                         U09 //
//                  BUILDING THE COMMAND ARRAY                 //
//                                                             //
/////////////////////////////////////////////////////////////////
// What happens when you click the submit button or when the   //
// UGUI Dev Tools are updated to preview the outputted command //
// that would be sent to the cmd line/terminal.                //
/////////////////////////////////////////////////////////////////

function buildCommandArray(thisExecutable) {
    //Validate types
    if (thisExecutable !== undefined && typeof(thisExecutable) !== "string") {
        console.info("Executable must be passed as a string.");
        return;
    }

    //If no executable was passed in, just use the first one in <cmd>'s
    thisExecutable = thisExecutable || executable[0];

    //Set up commands to be sent to command line
    var cmds = [ thisExecutable ];

    //fill out window.ugui.args {}
    buildUGUIArgObject();

    //Process all definitions and place them in window.ugui.args
    patternMatchingDefinitionEngine();

    //Setting up arrays
    var cmdArgsText = [];
    //Loop through all the args in the selected executable
    for (index = 0; index < $("cmd[executable=" + thisExecutable + "] arg").length; index++) {
        //set the current arg
        var currentArg = $("cmd[executable=" + thisExecutable + "] arg")[index];
        //Put the arg text into an array
        cmdArgsText.push( $(currentArg).text() );
    }

    //loop through all phrases and add processed versions to output array
    for (index = 0; index < cmdArgsText.length; index++) {
        //cmdArgsText[index] is "--quality ((meow)) to ((oink.min))"
        cmds.push( parseArgument(cmdArgsText[index]) );
    }

    //After all the processing is done and the array is built, return it
    return cmds;
}







/////////////////////////////////////////////////////////////////
//                                                         U10 //
//                    BUILD UGUI ARG OBJECT                    //
//                                                             //
/////////////////////////////////////////////////////////////////
// This grabs all the data about the elements on the page that //
// have a data-argName and puts that information on the window //
// object, located here: window.ugui.args                      //
/////////////////////////////////////////////////////////////////

function buildUGUIArgObject() {
    //Reset the Args Object to remove any stragglers
    window.ugui.args = {};

    var cmdArgs = $("*[data-argName]");

    //Cycle through all elements with a data-argName in <form id="currentexecutable">
    for (index = 0; index < cmdArgs.length; index++) {

        //get "bob" from <input data-argName="bob" value="--kitten" />
        var argName = $(cmdArgs[index]).attr("data-argName");

        var argValue = "";
        var argType = "";

        //See if the current item is a range slider
        if ( $(cmdArgs[index]).hasClass("slider") ) {
            //get "6" from <input data-argname="bob" value="6" type="text" class="slider" />
            argValue = $(cmdArgs[index]).val();

            //get checkbox from <input data-argName="bob" type="checkbox" />
            argType = "range";
        } else {
            //get "--kitten" from <input data-argName="bob" value="--kitten" />
            argValue = $(cmdArgs[index]).val();

            //get checkbox from <input data-argName="bob" type="checkbox" />
            argType = $(cmdArgs[index]).attr("type");
        }

        //get input from <input data-argName="bob" type="checkbox" />
        var argTag = $(cmdArgs[index]).prop("tagName").toLowerCase();

        //Basic info put on every object
        window.ugui.args[argName] = {
            "value": argValue,
            "htmltag": argTag,
            "htmltype": argType
        };

        //Special info just for <input type="file">
        if (argType === "file") {
            setInputFilePathNameExt(cmdArgs[index], argName);
            window.ugui.args[argName].htmltag = argTag;
            window.ugui.args[argName].htmltype = argType;
        }

        //Special info just for <input type="color">
        if (argType === "color") {
            colorProcessor(argValue, argName);
            window.ugui.args[argName].htmltag = argTag;
            window.ugui.args[argName].htmltype = argType;
        }

        //For checkboxes and radio dials, add special info
        if (argType === "checkbox" || argType === "radio") {
            if ( $(cmdArgs[index]).prop("checked") ) {
                window.ugui.args[argName].htmlticked = true;
            } else {
                window.ugui.args[argName].htmlticked = false;
            }
        }

        if (argTag === "textarea") {
            window.ugui.args[argName] = {
                "value": argValue,
                "htmltag": argTag,
                "htmltype": "textarea"
            };
        }

    }

}

//Run once on page load
buildUGUIArgObject();







/////////////////////////////////////////////////////////////////
//                                                         U11 //
//                       FIND KEY VALUE                        //
//                                                             //
/////////////////////////////////////////////////////////////////
// This is a general purpose function that allows retrieving   //
// information from an object. Here is an example object and   //
// how findKeyValue() works to return data from it:            //
//                                                             //
//     var a = {                                               //
//         "b": "dog",                                         //
//         "c": {                                              //
//             "d": "cat",                                     //
//             "e": "bat"                                      //
//         }                                                   //
//     };                                                      //
//     var ab  = ["b"];                                        //
//     var acd = ["c","d"];                                    //
//                                                             //
//     console.log( findKeyValue(a,ab) );  //dog               //
//     console.log( findKeyValue(a,acd) ); //cat               //
//                                                             //
/////////////////////////////////////////////////////////////////

function findKeyValue(obj, arr) {
    //Validate that both required arguments are passed
    if(!obj || !arr) {
        console.info("You need to supply an object and an array of strings to drill down within the object.");
        return;
    }
    //Validate types
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
        console.info("First argument must be passed as an object.");
        return;
    } else if (Object.prototype.toString.call(arr) !== "[object Array]") {
        console.info("Second argument must be passed as strings in an array.");
        return;
    }
    //Validate that all items of the array are strings
    for (i = 0; i < arr.length; i++) {
        if (typeof(arr[i]) !== "string") {
            console.info("Second argument must be passed as strings in an array.");
            return;
        }
    }

//console.log(obj, arr);
    for (var i = 0; i < arr.length; i++) {
        obj = obj[arr[i]];
    }
    //For stuff like ((moo)), assume the user means ((moo.value))
    if (Object.prototype.toString.call(obj) === "[object Object]") {
        obj = obj.value;
    }
//console.log(obj);
    return obj;
}







/////////////////////////////////////////////////////////////////
//                                                         U12 //
//                       PARSE ARGUMENT                        //
//                                                             //
/////////////////////////////////////////////////////////////////
// This takes the argument from the <cmd><arg>, finds all the  //
// ((keywords)) and replaces them with the information on the  //
// UGUI Args Object found here: window.ugui.args               //
/////////////////////////////////////////////////////////////////

function parseArgument(argumentText) {
    //Validate that required argument is passed
    if (!argumentText) {
        console.info("This processes strings of text that contain ((keywords)) in them from the <cmd> tags.");
        return;
    }
    //Validate types
    if (typeof(argumentText) !== "string") {
        console.info("Argument text must be passed as a string.");
        return;
    }

    //argumentText = "and ((meow)), with ((oink)) too. "
    var regexToMatch = /\(\((.*?)\)\)/;

    //Keep rerunning this until all ((keywords)) in argumentText are replaced with their actual values
    while ( regexToMatch.test(argumentText) ) {

        //match = ["((meow))","meow"]
        var match = regexToMatch.exec(argumentText);
        var uguiArgObj = window.ugui.args;

        var regExMatch = RegExp( "\\(\\(" + match[1] + "\\)\\)" );
        //matched = uguiArgObj.meow
        var matched = uguiArgObj[match[1]];

        if (matched === undefined) {
            var matchName = match[1].split(".")[0];
            matched = uguiArgObj[matchName];
        }

//console.log( "-----------------" );
//console.log( "value: ", matched.value );

        //Skip all unchecked checkboxes and unchecked radio dials.
        //Skip everything without a value
        if (
            (matched.htmltype === "checkbox" && matched.htmlticked === false) ||
            (matched.htmltype === "radio" && matched.htmlticked === false) ||
            (typeof(matched.value) === "undefined") ||
            (matched.value === "")
           ) {
            //Replace the "--quality ((meow))" with ""
            argumentText = "";
            return argumentText;
        //Run all the non-checkbox/radio/file elements,
        //all checked checkboxes and checked radio dials
        } else if (
            (matched.htmltype !== "checkbox" && matched.htmltype !== "radio") ||
            (matched.htmltype === "checkbox" && matched.htmlticked === true) ||
            (matched.htmltype === "radio" && matched.htmlticked === true)
           ) {
            //Find the correct value from the UGUI Args Object
            var foundKeyValue = findKeyValue( uguiArgObj, match[1].split(".") );
            //Replace the "--quality ((meow))" with "--quality 9"
            argumentText = argumentText.replace( regExMatch, foundKeyValue );
        //And whatever's left
        } else {
            //Replace the "--quality ((meow))" with ""
            argumentText = "";
        }

//console.log(argumentText);

    }

    return argumentText;
}







/////////////////////////////////////////////////////////////////
//                                                         U13 //
//                 PROCESS ALL CMD DEFINITIONS                 //
//                                                             //
/////////////////////////////////////////////////////////////////
// This loops through all <def>'s and processes the value of   //
// them to create the correct key value pairs on the ugui args //
// object.                                                     //
/////////////////////////////////////////////////////////////////

function patternMatchingDefinitionEngine() {
    //A regular expression that matches ((x)) and captures x
    var re = /\(\((.*?)\)\)/gi;

    $("def").each(function(index, value) {
        //Assign "value" to def
        //def = <def name="quality">((min)),((max))</def>
        var def = value;

        //Get the actual definition from the def
        //definition = "((min)),((max))"
        var definition = $("def").html();

        //Get the arg associated with this def
        //arg = ugui.args.quality
        var arg = ugui.args[$("def").attr("name")];

        var match;
        var currentIndex = 0;
        var seperators = [];
        var args = [];
        //Loop through the definition grabbing all the seperators and args
        while (true) {
            //Assign the RegEx result to match and check to see if there is a match
            if ((match = re.exec(definition)) !== null) {
                //Grab any text seperating the values and push it to a collector array
                seperators.push(definition.slice(currentIndex, match.index));
                //Update the slice start index for the next iteration
                currentIndex = re.lastIndex;

                //Add the arg from the definition to the global UGUI object
                arg[match[1]] = "";

                //Add the arg to the args array for value assignment in next loop
                args.push(match[1]);
            //If there are no more args:
            } else {
                //Put the last part of the def into the seperator array
                seperators.push(definition.slice(currentIndex));
                //End the loop. Very important!!!
                break;
            }
        };

        //Get the value of the associated arg
        //argValue = "0,75"
        var argValue = arg.value;

        //splitIndex is used to keep track of where we are in the value
        splitIndex = 0;

        //Loop through the args defined by this def, parse the value using the seperators, and assign the correct value
        for (var i = 0; i < args.length; i++) {
            //The seperators around the current arg
            //firstSeperator = ""
            //secondSeperator = ","
            firstSeperator = seperators[i];
            secondSeperator = seperators[i + 1];

            //The first if catches cases where the dev has unnecessarily used a def
            if (firstSeperator == "" && secondSeperator == "") {
                arg[args[i]] = argValue;
            //This catches if there is no text before the first value to map
            } else if (firstSeperator == "") {
                arg[args[i]] = argValue.slice(splitIndex, argValue.indexOf(secondSeperator));
                splitIndex = argValue.indexOf(secondSeperator);
            //This catches if there is no text after the last value to map
            } else if (secondSeperator == "") {
                arg[args[i]] = argValue.slice((argValue.indexOf(firstSeperator, splitIndex) + firstSeperator.length));
            //This catches in all other cases
            } else {
                arg[args[i]] = argValue.slice((argValue.indexOf(firstSeperator, splitIndex) + firstSeperator.length), argValue.indexOf(secondSeperator, (splitIndex + firstSeperator.length)));
                splitIndex = argValue.indexOf(secondSeperator, (splitIndex + firstSeperator.length))
            }
        }
    })
}







/////////////////////////////////////////////////////////////////
//                                                         U14 //
//        SET INPUT FILE PATH, FILE NAME, AND EXTENSION        //
//                                                             //
/////////////////////////////////////////////////////////////////
// This processes everything elements with a data-argName that //
// are also <input type="file">. It creates special properties //
// for it on the UGUI args object found here: window.ugui.args //
/////////////////////////////////////////////////////////////////

function setInputFilePathNameExt(currentElement, argName) {
    //Validate that both required arguments are passed
    if (!currentElement || !argName) {
        console.info("You must pass in the element as an object and its argName as a string.");
        return;
    }
    //Validate types
    if (typeof(currentElement) !== "object") {
        console.info("Element must be passed as a jQuery object.");
        return;
    } else if (typeof(argName) !== "string") {
        console.info("The argName must be passed as a string.");
        return;
    }

    //Create a variable that contains all the file information supplied by webkit
    var fileAttributes = currentElement.files[0];

    //Before continuing, verify that the user has selected a file
    if (fileAttributes) {

        //Detect if in darwin, freebsd, linux, sunos or win32
        var platform = process.platform;

        //Create filename and filepath variables to be used below
        var filename = "";
        var filepath = "";

        // Either C:\users\bob\desktop\cows.new.png or /home/bob/desktop/cows.new.png
        var fullFilepath = fileAttributes.path;

        //cows.new.png
        filename = fileAttributes.name;

        //If you're on windows then folders in filepaths are separated with \, otherwise OS's use /
        if ( platform == "win32" ) {
            //Get the index of the final backslash so we can split the name from the path
            var lastBackslash = fullFilepath.lastIndexOf("\\");
            // C:\users\bob\desktop\
            filepath = fullFilepath.substring(0, lastBackslash+1);
        } else {
            //Get the index of the final backslash so we can split the name from the path
            var lastSlash = fullFilepath.lastIndexOf("/");
            // /home/bob/desktop/
            filepath = fullFilepath.substring(0, lastSlash+1);
        }

        //Split "cows.new.png" into ["cows", "new", "png"]
        var filenameSplit = filename.split(".");
        //Remove last item in array, ["cows", "new"]
        filenameSplit.pop();
        //Combine them back together as a string putting the . back in, "cows.new"
        var filenameNoExt = filenameSplit.join(".");

        //create the args object parameters on the ugui object
        window.ugui.args[argName] = {
            "fullpath": fileAttributes.path,
            "path": filepath,
            "name": filenameNoExt,
            "nameExt": filename,
            "ext": filename.split(".").pop(),
            "lastModified": fileAttributes.lastModified,
            "lastModifiedDate": fileAttributes.lastModifiedDate,
            "size": fileAttributes.size,
            "type": fileAttributes.type,
            "value": fileAttributes.path,
            "webkitRelativePath": fileAttributes.webkitRelativePath
        };

    }
}

/*
function htmlEscape(str) {
    if (!str) return;
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
*/







/////////////////////////////////////////////////////////////////
//                                                         U15 //
//                       COLOR PROCESSOR                       //
//                                                             //
/////////////////////////////////////////////////////////////////
// Process input elements with a type of color to generate     //
// RGB, Hex, and Decimal values, then place them on the        //
// ugui.args.{data-argName} object.                            //
/////////////////////////////////////////////////////////////////

function colorProcessor(inputColor, argName) {
    //Validate that both required arguments are passed
    if (!inputColor || !argName) {
        console.info("You must pass in your Hex color (#FF0000) as a string accompanied by it's argName.");
        return;
    }
    //Validate types
    if (typeof(inputColor) !== "string") {
        console.info("Hex color must be passed as a string.");
        return;
    } else if (inputColor[0] !== "#") {
        console.info("Hex color must begin with #.");
        return;
    } else if (typeof(argName) !== "string") {
        console.info("argName must be passed as a string.");
        return;
    }

    //setup variables
    var R = ""; var r = "";
    var G = ""; var g = "";
    var B = ""; var b = "";
    var rgb = inputColor.split("");
    var sansOctothorpe = rgb[1] + rgb[2] + rgb[3] + rgb[4] + rgb[5] + rgb[6];

    for (var i = 1; i < rgb.length; i++) {
        var rgbi = rgb[i];
        //Convert Hex to Dec
        if (rgbi == "A" || rgbi == "a") { rgbi = "10" }
        if (rgbi == "B" || rgbi == "b") { rgbi = "11" }
        if (rgbi == "C" || rgbi == "c") { rgbi = "12" }
        if (rgbi == "D" || rgbi == "d") { rgbi = "13" }
        if (rgbi == "E" || rgbi == "e") { rgbi = "14" }
        if (rgbi == "F" || rgbi == "f") { rgbi = "15" }

        //set RrGgBb to decimal
        if (i === 1) { R = rgbi; } else
        if (i === 2) { r = rgbi; } else
        if (i === 3) { G = rgbi; } else
        if (i === 4) { g = rgbi; } else
        if (i === 5) { B = rgbi; } else
        if (i === 6) { b = rgbi; }
    }

    //as 0-255
    var Red   = (parseInt(R) * 16) + parseInt(r);
    var Green = (parseInt(G) * 16) + parseInt(g);
    var Blue  = (parseInt(B) * 16) + parseInt(b);

    //as 0-100%
    var RP = Math.floor( (Red/255) * 100 );
    var GP = Math.floor( (Green/255) * 100 );
    var BP = Math.floor( (Blue/255) * 100 );

    var DecRrGgBb = R + " " + r + " " + G + " " + g + " " + B + " " + b;
    //create the args object parameters on the ugui object
    window.ugui.args[argName] = {
        "rgb": "rgb(" + Red + "," + Green + "," + Blue + ")",
        "decred": Red,
        "decgreen": Green,
        "decblue": Blue,
        "decRrGgBb": DecRrGgBb,
        "hexRrGgBb": sansOctothorpe,
        "percentRed": RP,
        "percentGreen": GP,
        "percentBlue": BP,
        "value": inputColor
    };
}







/////////////////////////////////////////////////////////////////
//                                                         U16 //
//               CONVERT COMMAND ARRAY TO STRING               //
//                                                             //
/////////////////////////////////////////////////////////////////
// Take the array of executable and commands, remove empty     //
// arguments and put everything into a string to be sent out   //
// to the command line.                                        //
/////////////////////////////////////////////////////////////////

function convertCommandArraytoString( cmdArray ) {
    //Validate that the required argument is passed
    if (!cmdArray) {
        console.info(
            "Accepts an array of executable and commands, " +
            "removes empty arguments and puts everything into a string " +
            "ready to be sent out to the command line."
        );
        return;
    }
    //Validate types
    if (Object.prototype.toString.call(cmdArray) !== "[object Array]") {
        console.info("Command array must be passed as strings in an array.");
        return;
    }
    //Validate that all items of the array are strings
    for (i = 0; i < cmdArray.length; i++) {
        if (typeof(cmdArray[i]) !== "string") {
            console.info("Arguments must be passed as strings in an array.");
            return;
        }
    }

    //Create and empty variable
    var cmdString = "";

    //cmdArray = ["cli_filename", "", "", "-nyan", "--speed 1mph", "", "", "-pear", "--potato", "", "", "", "-m "Text"", ""C:\Users\jwilcurt\Desktop\IICL Stuff.new.png""]
    for (index = 0; index < cmdArray.length; index++) {
        //Make sure the executable isn't preceeded with a space
        if (index === 0) {
            cmdString = cmdArray[0];
        //add in the rest of the arguments, skipping blank ones
        } else if (cmdArray[index]) {
            cmdString = cmdString + " " + cmdArray[index];
        }
    }

    //Return the command string that will be ran
    return cmdString;
}







/////////////////////////////////////////////////////////////////
//                                                         U17 //
//        REPLACE HTML TEXT WITH TEXT FROM PACKAGE.JSON        //
//                                                             //
/////////////////////////////////////////////////////////////////
// Some text on the page can be auto-filled from the content   //
// in the package.json. This replaces the text on the page.    //
/////////////////////////////////////////////////////////////////

$(".applicationName").html(appName);
$(".applicationTitle").html(appTitle);
$(".applicationDescription").html(appDescription);
getAboutModal();







/////////////////////////////////////////////////////////////////
//                                                         U18 //
//                     UPDATE ABOUT MODAL                      //
//                                                             //
/////////////////////////////////////////////////////////////////
// This pulls in information about the application from the    //
// package.json file and puts in in the About modal. It also   //
// pulls in UGUI's about info from the _markdown folder.       //
/////////////////////////////////////////////////////////////////

function getAboutModal() {
    $.get("_markup/ugui-about.htm", function( aboutMarkup ) {
        //Put UGUI about info in about modal
        $("#aboutModal .modal-body").append( aboutMarkup );

        //Wait for the "UGUI about" info to be loaded before updating the "App about" section
        //Load application name, version number, and author from package.json
        $(".applicationName").html(appName);
        $(".versionApp").html(appVersion).prepend("V");
        $(".authorName").html(authorName);
        $(".versionUGUI").html(uguiVersion);
        $("#aboutModal .nwjsVersion").append(" (Version " + process.versions["node-webkit"] + ")");
        $("#aboutModal .chromiumVersion").append(" (Version " + process.versions["chromium"] + ")");
        $("#aboutModal .iojsVersion").append(" (Version " + process.versions["node"] + ")");

        //After all content is loaded, detect all links that should open in the default browser
        openDefaultBrowser();

        //Remove modal, enable scrollbar
        function removeModal() {
            $("#aboutModal").slideUp("slow", function() {
                $("body").css("overflow","auto");
                //If the navigation is expanded, then close it after exiting the modal
                if ( !$(".navbar-toggle").hasClass("collapsed") ) {
                    $(".navbar-toggle").trigger("click");
                }
            });
        }

        //When clicking on background or X, remove modal
        $("#aboutModal").click( removeModal );
        //allow you to click in the modal without triggering the removeModal function called when you click it's parent element
        $("#aboutModal .modal-content").click( function( event ) {
            event.stopPropagation();
        });
        $("#aboutModal .glyphicon-remove").click( removeModal );

    });
}







/////////////////////////////////////////////////////////////////
//                                                         U19 //
//                 NAVIGATION BAR FUNCTIONALITY                //
//                                                             //
/////////////////////////////////////////////////////////////////
// Everything in this section controls the visibility and the  //
// functionality of the items in the top nav bar.              //
/////////////////////////////////////////////////////////////////

//Clicking View > Command Line Output in the Nav Bar
$('.navbar a[href="#cmdoutput"]').click( function() {
    $('#uguiDevTools nav span[data-nav="uguiCommand"]').trigger("click");
});

//Clicking View > Console in the Nav Bar
$('.navbar a[href="#console"]').click( function() {
    require("nw.gui").Window.get().showDevTools();
});

//Clicking View > Fullscreen
$('.navbar a[href="#fullscreen"]').click( function() {
    require("nw.gui").Window.get().toggleFullscreen();
});

//Clicking "About" in the Nav Bar
$('.navbar a[href="#about"]').click( function() {

    //Get the current Window
    var win = require("nw.gui").Window.get();

    //Show the modal
    $("#aboutModal").fadeIn("slow");

    function setModalHeight() {
        if ( win.height < 301 ) {
            $(".modal-header").addClass("shortScreen");
        } else {
            $(".modal-header").removeClass("shortScreen");
        }
        modalBodyHeight();
    }

    //Get the current height of the window and set the modal to 75% of that
    function modalBodyHeight() {
        $("#aboutModal .modal-body").css("max-height", (win.height * 0.5) + "px" );
    }

    //Make the header of the modal small when app is tiny
    setModalHeight();
    win.on("resize", setModalHeight );

    //Remove page scrollbar when modal displays
    $("body").css("overflow", "hidden");

});

//Makes sure that the logo and app name in the nav bar are vertically centered
function centerNavLogo() {
    var navHeight = $(".navbar").height();
    $(".navbar-brand").css("line-height", navHeight + "px");
    $(".navbar-brand").css("padding-top", "0px");
    $(".navbar-brand *").css("line-height", navHeight + "px");
}

//Run once on page load
centerNavLogo();

//When you click on the X in the top corner, close this instance of Node-Webkit
$('.navbar a[href="#exit"]').click( function() {
    require("nw.gui").Window.get().close(true);
});







/////////////////////////////////////////////////////////////////
//                                                         U20 //
//              DETECT IF IN DEVELOPER ENVIRONMENT             //
//                                                             //
/////////////////////////////////////////////////////////////////
// Detects if you're in Development or Production environment. //
//                                                             //
// If you have a class of "dev" or "prod" in the body tag UGUI //
// will enable key bindings such as F12 or CTRL+Shift+I to     //
// launch Webkit's Developer Tools, or F5 to refresh. Also it  //
// displays the Command Line output at the bottom of the page. //
/////////////////////////////////////////////////////////////////

//Check if the body has a class of prod for Production Environment
if ( $("body").hasClass("prod") ) {
    $("#uguiDevTools").remove();
} else if ( $("body").hasClass("dev") ) {
    //Create UGUI Dev Tools markup
    $.get("_markup/ugui-devtools.htm", function( uguiDevToolsMarkup ) {
        //Put Dev Tool Markup on the page
        $("body.dev").append( uguiDevToolsMarkup );
        //Update the UGUI version to the correct version
        $("#uguiDevTools .versionUGUI").html(window.ugui.version);
        fillExecutableDropdowns();
        putExeHelpInDevTools();
        $("#uguiDevTools section").addClass("shrink");
        $("#uguiDevTools section *").addClass("shrink");
        $("#uguiDevTools").show();

        updateCommandLineOutputPreviewHint();

        //Hide/Show based on UGUI Dev Tools navigation
        $("#uguiDevTools nav span").click( function() {
            var sectionClicked = $(this).attr("data-nav");
            $("#uguiDevTools nav span").removeClass("selected");

            if ( $("#uguiDevTools section." + sectionClicked).hasClass("shrink") ) {
                $("#uguiDevTools nav span[data-nav=" + sectionClicked + "]").addClass("selected");
                $("#uguiDevTools section").addClass("shrink");
                $("#uguiDevTools section *").addClass("shrink");
                $("#uguiDevTools section." + sectionClicked).removeClass("shrink");
                $("#uguiDevTools section." + sectionClicked + " *").removeClass("shrink");
            } else {
                $("#uguiDevTools nav span[data-nav=" + sectionClicked + "]").removeClass("selected");
                $("#uguiDevTools section." + sectionClicked).addClass("shrink");
                $("#uguiDevTools section." + sectionClicked + " *").addClass("shrink");
            }
        });

        $(".uguiCommand .executableName").change( updateCommandLineOutputPreviewHint );

        swatchSwapper();

        //When the developer clicks "Keep"
        $("#setNewSwatch").click( function() {
            //The currently selected swatch
            var newSwatch = $("#swatchSwapper").val();
            //Update index.htm to use the selected swatch as the new default
            saveNewSwatch(newSwatch);
        });

    });

    //get node webkit GUI - WIN
    var gui = require("nw.gui");
    // get the window object
    var win = require("nw.gui").Window.get();

    //Keyboard shortcuts
    keyBindings();

    //Check for duplicat Arg Names
    warnIfDuplicateArgNames();

}

function updateCommandLineOutputPreviewHint() {
    var commandLineOutputExecutable = $(".uguiCommand .executableName").val();
    $("#commandLine").html('<span class="commandLineHint">Click the <em>' + $('#' + commandLineOutputExecutable + ' .sendCmdArgs').html() + '</em> button to see output.</span>');
}







/////////////////////////////////////////////////////////////////
//                                                         U21 //
//               PUT ALL EXECUTABLES IN DROPDOWNS              //
//                                                             //
/////////////////////////////////////////////////////////////////
// In the UGUI Dev Toolbar, there are dropdowns in the "CMD    //
// Output" and "Exectuable Info" sections that contain all of  //
// the executables used in the app.                            //
/////////////////////////////////////////////////////////////////

function fillExecutableDropdowns() {
    var executables = ugui.executable;
    //check each file and put it in the dropdown box
    for (index = 0; index < executables.length; index++) {
        $(".executableName").append('<option value="' + executables[index] + '">' + executables[index] + '</option>');
    }
}







/////////////////////////////////////////////////////////////////
//                                                         U22 //
//               WARN IF IDENTICAL DATA-ARGNAMES               //
//                                                             //
/////////////////////////////////////////////////////////////////
// If the designer/developer uses the same data-argName value  //
// for multiple elements, display a warning.                   //
/////////////////////////////////////////////////////////////////

function warnIfDuplicateArgNames() {
    var duplicatesArray = {};
    var cmdArgs = "";
    var cmdArgsWithoutDuplicates = [];

    //Cycle through each executable
    for (index = 0; index < executable.length; index++) {
        //all elements with a data-argName in a form with a matching executable ID
        cmdArgs = "";
        cmdArgs = argsForm[index];
        duplicatesArray = {};

        //loop through all form elements for this executable
        for (var subindex = 0; subindex < cmdArgs.length; subindex++) {
            //put each element's data-argName and into an array
            duplicatesArray[cmdArgs[subindex].dataset.argname] = cmdArgs[subindex];
        }

        //Create a new array with duplicate argOrders removed
        cmdArgsWithoutDuplicates = [];
        for ( var key in duplicatesArray ) {
            cmdArgsWithoutDuplicates.push(duplicatesArray[key]);
        }

        //If the new array had any duplicates removed display a warning.
        if ( cmdArgsWithoutDuplicates.length < cmdArgs.length ) {
            $.get("_markup/ugui-multiargnames.htm", function(multiArgNamesMarkup) {
                //Put alert mesage at top of page
                $("body.dev").prepend( multiArgNamesMarkup );
            });
            //Keep the console warning formatted nicely for cli filenames under 16 characters in length
            var spacesNeeded = 16 - executable[index].length;
            var spaces = "";
            if (spacesNeeded > 0) {
                for (subindex = 0; subindex < spacesNeeded; subindex ++) {
                    spaces = spaces + " ";
                }
            }
            console.warn( "" );
            console.warn( "////////////////////////////////////////" );
            console.warn( "// All data-argName's must be unique. //" );
            console.warn( "// FOUND IN " + executable[index].toUpperCase() + " SECTION. " + spaces + "//" );
            console.warn( "////////////////////////////////////////" );
        }
    }
}







/////////////////////////////////////////////////////////////////
//                                                         U23 //
//             PUT CLI HELP INFO IN UGUI DEV TOOLS             //
//                                                             //
/////////////////////////////////////////////////////////////////
// This funciton is only ran when in dev mode. It adds another //
// tab in the UGUI Developer Tools that returns information    //
// from the user's executable with arguments like --help.      //
/////////////////////////////////////////////////////////////////

function putExeHelpInDevTools() {
    //Everytime the dropdown changes update the <pre>
    $("#uguiDevTools .executableName").change(getHelpInfo);
    $("#uguiDevTools .helpDropdown").change(getHelpInfo);

    function getHelpInfo() {
        //Grab the correct executable from the dropdown
        var executableChoice = $(".uguiExecutable .executableName").val();
        //Grab which kind of help argument they chose, like --help or /?
        var helpChoice = $(".uguiExecutable .helpDropdown").val();

        //Don't run if there isn't a help choice
        if (helpChoice) {
            //Run the executable using the user's chosen argument to get it's help info
            runcmd( executableChoice + " " + helpChoice, function(returnedHelpInfo) {
                //Put the help info in a <pre>
                $("#uguiDevTools pre.executableHelp").text( returnedHelpInfo );
            });
        }
    }
}







/////////////////////////////////////////////////////////////////
//                                                         U24 //
//                      SWAP BOOTSWATCHES                      //
//                                                             //
/////////////////////////////////////////////////////////////////
// This funciton is only ran when in dev mode. It grabs a list //
// of all files in the ven.bootswatch folder and puts them in  //
// a dropdown box in UGUI Developer Tools so developers can    //
// try out different stylesheets.                              //
/////////////////////////////////////////////////////////////////

function swatchSwapper() {
    //Grab all the files in the ven.bootswatch folder and put them in an array
    var allSwatches = fs.readdir("_style/ven.bootswatch", function(err, files) {
        //if that works
        if (!err) {
            //check each file and put it in the dropdown box
            for (index = 0; index < files.length; index++) {
                var cssFileName = files[index];                     //cerulean.min.css
                var swatchName = files[index].split(".min.css")[0]; //cerulean
                $("#swatchSwapper").append('<option value="_style/ven.bootswatch/' + cssFileName + '">' + swatchName + '</option>');
            }
        } else {
            console.warn("Could not return list of style swatches.");
        }
    });

    //When you change what is selected in the dropdown box, swap out the current swatch for the new one.
    $("#swatchSwapper").change( function() {
        $("head link[data-swatch]").attr( "href", $("#swatchSwapper").val() );
        //Nav logo wasn't vertically centering after changing a stylesheet because the function was being ran after
        //the stylesheet was swapped instead of after the page rendered the styles. Since Webkit does not have a way of
        //indicating when a repaint finishes, unfortunately a delay had to be used. 71 was chosen because 14 FPS is the
        //slowest you can go in animation before something looks choppy.
        window.setTimeout(centerNavLogo, 71);
        window.setTimeout(sliderHandleColor, 71);
    });

}







/////////////////////////////////////////////////////////////////
//                                                         U25 //
//                   SAVE CHOSEN BOOTSWATCH                    //
//                                                             //
/////////////////////////////////////////////////////////////////
// In the UGUI Developer Tools panel under the "Style Swapper" //
// section, when the user clicks the "Use this style" button,  //
// read the contents of the index.htm, find the line that sets //
// which swatch css to use and update it to the new chosen     //
// swatch. Then replace the contents of index.htm with the new //
// data so on every load it uses the correct swatch.           //
/////////////////////////////////////////////////////////////////

function saveNewSwatch(newSwatch) {
    //Validate that the required argument is passed and is the correct type
    if (!newSwatch || typeof(newSwatch) !== "string") {
        console.info("You must pass in a new swatch as a string");
        return;
    }

    //Set the filename to whatever the page is NW.js opens on launch, like index.htm
    var filename = window.ugui.app.startPage;

    //Read the contents of index.htm like a normal file and put them in the "data" variable
    fs.readFile(filename, "utf8", function(err, data) {
        //If it can't read it for some reason, throw an error
        if (err) {
            return console.log(err);
        }

        //Set up for the regex
        var re_start = '(<link rel="stylesheet" href="_style\\/ven\\.bootswatch\\/)';
        var re_file = '((?:[a-z][a-z\\.\\d_]+)\\.(?:[a-z\\d]{3}))(?![\\w\\.])';
        var re_end = '(" data-swatch="swapper">)';

        //would match: <link rel="stylesheet" href="_style/ven.bootswatch/cerulean.min.css" data-swatch="swapper">
        var createRegex = RegExp(re_start + re_file + re_end, ["i"]);
        var findSwatchLine = createRegex.exec(data);
        //If we could find the line in the file
        if (findSwatchLine != null) {
            //Though not currently using this line, it may come in handy some day
            //var currentSwatch = findSwatchLine[52];

            //Take the contents of index.htm, find the correct line, and replace that line with the updated swatch
            data = data.replace(createRegex, '<link rel="stylesheet" href="' + newSwatch + '" data-swatch="swapper">');
        }

        //With the contents of index.htm update, save over the file
        fs.writeFile(filename, data, function(err) {
            if (err) return console.log(err);
        });

        //Animate the "Saved" text, having it fade in
        $(".newSwatchSaved").addClass("showSaved");
        //Wait 2 seconds and then fade the "Saved" text out
        setTimeout(function() {
            $(".newSwatchSaved").removeClass("showSaved");
        }, 2000);

    });
}







/////////////////////////////////////////////////////////////////
//                                                         U26 //
//                  CUSTOM KEYBOARD SHORTCUTS                  //
//                                                             //
/////////////////////////////////////////////////////////////////
// This funciton is only ran when in dev mode. It gives the    //
// developer access to common/expected keyboard shortcuts.     //
/////////////////////////////////////////////////////////////////

function keyBindings() {
    //Keyboard shortcuts
    document.onkeydown = function(pressed) {
        ///Check CTRL + F key and do nothing :(
        if ( pressed.ctrlKey && pressed.keyCode === 70 ) {
            pressed.preventDefault();
            console.info("NW.js currently has no 'Find' feature built in. Sorry :(");
            return false;
        //Check CTRL+F5, CTRL+R, or CMD+R keys and hard refresh the page
        } else if (
            pressed.ctrlKey && pressed.keyCode === 116 ||
            pressed.ctrlKey && pressed.keyCode === 82 ||
            pressed.metaKey && pressed.keyCode === 82 ) {
                pressed.preventDefault();
                win.reloadDev();
                return false;
        //Check Shift+F5 and CMD+Shift+R keys and refresh ignoring cache
        } else if (
            pressed.shiftKey && pressed.keyCode === 116 ||
            pressed.metaKey && pressed.shiftKey && pressed.keyCode === 82 ) {
                pressed.preventDefault();
                win.reloadIgnoringCache();
                return false;
        //Check F5 key and soft refresh
        } else if ( pressed.keyCode === 116 ) {
            pressed.preventDefault();
            win.reload();
            return false;
        //Check F12, Ctrl+Shift+I, or Option+Shift+I and display Webkit Dev Tools
        } else if (
            pressed.keyCode === 123 ||
            pressed.ctrlKey && pressed.shiftKey && pressed.keyCode === 73 ||
            pressed.altKey && pressed.shiftKey && pressed.keyCode === 73 ) {
                pressed.preventDefault();
                win.showDevTools();
                return false;
        }
    };
}







/////////////////////////////////////////////////////////////////
//                                                         U27 //
//               LAUNCH LINKS IN DEFAULT BROWSER               //
//                                                             //
/////////////////////////////////////////////////////////////////
// Detects all links on the page with a class of external-link //
// and sets them to open the link in the user's default        //
// default browser instead of using NW.js as a browser.        //
/////////////////////////////////////////////////////////////////

function openDefaultBrowser() {

    // Load native UI library.
    var gui = require("nw.gui");

    // Open URL with default browser.
    $(".external-link").click( function( event ) {
        //prevent the link from loading in NW.js
        event.preventDefault();
        //get the href url for the current link
        var url = $(this).attr("href");
        //launch the user's default browser and load the URL for the link they clicked
        gui.Shell.openExternal(url);
    });
}
//Run once on page load
openDefaultBrowser();







/////////////////////////////////////////////////////////////////
//                                                         U28 //
//                     EZDZ: DRAG AND DROP                     //
//                                                             //
/////////////////////////////////////////////////////////////////
// Code for drag/drop/browse box. This was originally based on //
// EZDZ, but has been heavily modified for Bootstrap and NW.js //
// for cross-platform and Bootswatch compatibility.            //
//                                                             //
// After dropping a file in the EZDZ box, put the file name in //
// the EZDZ box. If the file is an image, display a thumbnail. //
/////////////////////////////////////////////////////////////////
// https://github.com/jaysalvat/ezdz                           //
/////////////////////////////////////////////////////////////////

$(".ezdz").on("dragover", function() {
    $(".ezdz label").removeClass("text-info");    //Static
    $(".ezdz label").removeClass("text-success"); //Dropped
    $(".ezdz label").addClass("text-warning");    //Hover
});

$(".ezdz").on("dragleave", function() {
    $(".ezdz label").removeClass("text-success"); //Dropped
    $(".ezdz label").removeClass("text-warning"); //Hover
    $(".ezdz label").addClass("text-info");       //Static
});

function ezdz(fileInfo) {
    //Validate that the required argument is passed and the correct type
    if (!fileInfo || typeof(fileInfo) !== "object") {
        console.info("You must pass in your file information as an object.");
        return;
    }

    var file = fileInfo;

    $(".ezdz label").removeClass("text-info");    //Static
    $(".ezdz label").removeClass("text-warning"); //Hover

    if (this.accept && $.inArray(file.type, this.accept.split(/, ?/)) == -1) {
        return alert("File type not allowed.");
    }

    $(".ezdz label").addClass("text-success");   //Dropped
    $(".ezdz img").remove();

    if ((/^image\/(gif|png|jpeg|jpg|webp|bmp|ico)$/i).test(file.type)) {
        var reader = new FileReader(file);

        reader.readAsDataURL(file);

        reader.onload = function(event) {
            var data = event.target.result;
            var $img = $("<img />").attr("src", data).fadeIn();

            $(".ezdz img").attr("alt", "Thumbnail of dropped image.");
            $(".ezdz span").html($img);
        };
    }

    //Update the text on screen to display the name of the file that was dropped
    var droppedFilename = file.name + " selected";
    $(".ezdz label").html(droppedFilename);

}







/////////////////////////////////////////////////////////////////
//                                                         U29 //
//                         RANGE SLIDER                        //
//                                                             //
/////////////////////////////////////////////////////////////////
// Enables all elements with a class of slider to use the      //
// boostrap-slider plugin.                                     //
/////////////////////////////////////////////////////////////////
// Documentation: http://seiyria.github.io/bootstrap-slider    //
/////////////////////////////////////////////////////////////////

$(".slider").slider({
    formatter: function(value) {
        return value;
    }
});

function sliderHandleSolid(themeColor) {
    //Validate that the required argument is passed and the correct type
    if (!themeColor || typeof(themeColor) !== "string") {
        console.info("You must pass in your theme color as a string in RGB format.");
        console.info('Example: rgb(141, 12, 70)');
        return;
    }

    //If the navbar is white set the slider handle to gray
    if (themeColor == "rgb(255, 255, 255)") {
        $(".slider .slider-handle").css("background-color", "#7E7E7E");
    } else {
        //Set the color of the slider handle to match the color of the nav bar
        $(".slider .slider-handle").css("background-color", themeColor);
    }
}

function sliderHandleGradient(themeGradient) {
    //Validate that the required argument is passed and the correct type
    if (!themeGradient || typeof(themeGradient) !== "string") {
        console.info("You must pass in your theme gradient as a string in RGB format.");
        console.info('Example: linear-gradient(rgb(84, 180, 235), rgb(47, 164, 231) 60%, rgb(29, 156, 229))');
        return;
    }

    $(".slider .slider-handle").css("background-image", themeGradient);
}

function sliderHandleColor() {
    //remove the color of the slider handle
    $(".slider .slider-handle").css("background-image", "none");

    //get the color of the nav bar
    var themeColor = $(".navbar").css("background-color");
    //get the background image or gradient
    var themeGradient = $(".navbar").css("background-image");

    if (themeGradient == "none") {
        sliderHandleSolid(themeColor);
    } else {
        sliderHandleGradient(themeGradient);
    }

}

//Run once on page load
sliderHandleColor();







/////////////////////////////////////////////////////////////////
//                                                         U30 //
//                 CUT/COPY/PASTE CONTEXT MENU                 //
//                                                             //
/////////////////////////////////////////////////////////////////
// Right-click on any text or text field and you can now C&P!  //
//                                                             //
// Credit: https://github.com/b1rdex/nw-contextmenu            //
/////////////////////////////////////////////////////////////////

function cutCopyPasteMenu() {
    function Menu(cutLabel, copyLabel, pasteLabel) {
        var gui = require("nw.gui");
        var menu = new gui.Menu();

        var cut = new gui.MenuItem( {
            label: cutLabel || "Cut",
            click: function() {
                document.execCommand("cut");
                console.log("Menu:", "cutted to clipboard");
            }
        });
        var copy = new gui.MenuItem({
            label: copyLabel || "Copy",
            click: function() {
                document.execCommand("copy");
                console.log("Menu:", "copied to clipboard");
            }
        });
        var paste = new gui.MenuItem({
            label: pasteLabel || "Paste",
            click: function() {
                document.execCommand("paste");
                console.log("Menu:", "pasted to textarea");
            }
        });

        menu.append(cut);
        menu.append(copy);
        menu.append(paste);

        return menu;
    }

    var menu = new Menu(/* pass cut, copy, paste labels if you need in */);
    $(document).on("contextmenu", function(event) {
        event.preventDefault();
        menu.popup(event.originalEvent.x, event.originalEvent.y);
    });
}

//run once on page load
cutCopyPasteMenu();



function saveSettings() {
    //Make sure args object is up to date
    window.ugui.helpers.buildUGUIArgObject();
    //Grab the args object and JSONify it
    var settingsJSON = JSON.stringify(ugui.args);
    //Find the path to the settings file and store it
    var gui = require('nw.gui');
    var settingsFile = (gui.App.dataPath + '/uguisettings.json');

    //Attempt to read the file
    fs.readFile(settingsFile, {encoding: 'utf-8'}, function(err, data){
        //If it's not found, make it!
        if (err) {
            fs.writeFileSync(settingsFile, settingsJSON);
        //If it is found, overwrite it!
        } else {
            fs.writeFileSync(settingsFile, '');
            fs.writeFileSync(settingsFile, settingsJSON);
        }
    });
}

function loadSettings() {
    //Find the path to the settings file and store it
    var gui = require('nw.gui');
    var settingsFile = (gui.App.dataPath + '/uguisettings.json');

    //Attempt to read the file
    fs.readFile(settingsFile, {encoding: 'utf-8'}, function(err, data){
        //If it's not found, move on with your life!
        if (err) {
            return;
        //If it is found, load that shit!
        } else {
            var settingsObj = JSON.parse(data);
            //Iterate through the saved settings and update the UI
            for (key in settingsObj) {
                //Check if the key has a corresponding UI element
                //and that it isn't set to 'do not save'
                if ($('[data-argName'+ key + ']') && !($('[data-argName'+ key + ']').hasClass('do-not-save'))) {
                    console.log(settingsObj[key].htmltype);
                    //Update based on type of key:
                    if (settingsObj[key].htmltype == 'file') {
                        //File: file
  //ISSUE                      //YEA I DUNNO
                    } else if (settingsObj[key].htmltype == 'radio') {
                        //Radio dials: checked
                        if (settingsObj[key].htmlticked == true) {
                            $('[data-argName=' + key + ']').prop('checked', true);
                        } else {
                            $('[data-argName=' + key + ']').prop('checked', false);
                        }
                    } else if (settingsObj[key].htmltype == 'checkbox') {
                        //Checkbox: checked
                        if (settingsObj[key].htmlticked == true) {
                            $('[data-argName=' + key + ']').prop('checked', true);
                        } else {
                            $('[data-argName=' + key + ']').prop('checked', false);
                        }
                    } else if (settingsObj[key].htmltype == 'color') {
                        //Color: value
                        //This one actually updates the color and is most important!
                        $('[data-argName=' + key + ']').val(settingsObj[key].value);
                        //This one updates the html value, which doesn't do anything that I can tell
                        $('[data-argName=' + key + ']').attr('value', settingsObj[key].value);
                    } else if (settingsObj[key].htmltype == 'range') {
                        //Range: value
                        //Check if the value is not a number, which means it's a 2 value slider
                        //ie: '0,25'
                        if (isNaN(settingsObj[key].value)) {
                            var parsedValue =
                                settingsObj[key].value
                                .split(',')
                                .map(function(num) {
                                    return parseInt (num)
                                });
                            $('[data-argName=' + key + ']').slider('setValue', parsedValue);
                        } else {
                            $('[data-argName=' + key + ']').slider('setValue', parseInt(settingsObj[key].value));
                        }

                    } else if (settingsObj[key].htmltype == 'textarea') {
                        //Textarea: text
                        $('[data-argName=' + key + ']').text(settingsObj[key].value);
                    } else if (settingsObj[key].htmltype == 'text') {
                        //Textarea: text
                        $('[data-argName=' + key + ']').val(settingsObj[key].value);
                    }
                }
            }
            //Build the arg object based on our updated UI
            buildUGUIArgObject();
        }
    });

}


/////////////////////////////////////////////////////////////////
//                                                         U31 //
//                       THE UGUI OBJECT                       //
//                                                             //
/////////////////////////////////////////////////////////////////
// We expose parts of UGUI to developers via the UGUI object.  //
// To quickly access what is available type "ugui" into the    //
// NW.js Developer Tools console.                              //
/////////////////////////////////////////////////////////////////

window.ugui = {
    "allArgElements": allArgElements,
    "app": {
        "description": appDescription,
        "name": appName,
        "title": appTitle,
        "version": appVersion,
        "author": authorName,
        "packageJSON": packageJSON,
        "startPage": indexFile,
    },
    "args": window.ugui.args,
    "executable": executable,
    "platform": process.platform,
    "textFields": textFields,
    "version": uguiVersion,
    "helpers": {
        "readAFile": readAFile,
        "runcmd": runcmd,
        "runcmdClassic": runcmdClassic,
        "removeTypedQuotes": removeTypedQuotes,
        "updateUGUIDevCommandLine": updateUGUIDevCommandLine,
        "buildCommandArray": buildCommandArray,
        "buildUGUIArgObject": buildUGUIArgObject,
        "findKeyValue": findKeyValue,
        "parseArgument": parseArgument,
        "convertCommandArraytoString": convertCommandArraytoString,
        "centerNavLogo": centerNavLogo,
        "updateCommandLineOutputPreviewHint": updateCommandLineOutputPreviewHint,
        "fillExecutableDropdowns": fillExecutableDropdowns,
        "warnIfDuplicateArgNames": warnIfDuplicateArgNames,
        "openDefaultBrowser": openDefaultBrowser,
        "saveSettings": saveSettings,
        "loadSettings": loadSettings
    }
};







}// end ugui();
