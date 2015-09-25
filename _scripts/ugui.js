//UGUI is a library and framework used to bootstrap NW.js
//projects however it specializes in allowing the quick and
//easy conversion of CLI to GUI.

//## TABLE OF CONTENTS
//
//**U00**. [Intro](#u00-intro)  
//**U01**. [UGUI variables](#u01-ugui-variables)  
//**U02**. [Read a file](#u02-read-a-file)  
//**U03**. [Run CMD](#u03-run-cmd)  
//**U04**. [Run CMD (Advanced)](#u04-run-cmd-advanced)  
//**U05**. [Prevent user from entering quotes in forms](#u05-prevent-user-from-entering-quotes-in-forms)  
//**U06**. [Submit is locked until required is fulfilled](#u06-submit-locked-until-required-fulfilled)  
//**U07**. [Realtime updating of command output in UGUI Dev Tools](#u07-realtime-updating-dev-tool-command-output)  
//**U08**. [Clicking Submit](#u08-clicking-submit)  
//**U09**. [Building the command array](#u09-building-the-command-array)  
//**U10**. [Build UGUI Args object](#u10-build-ugui-arg-object)  
//**U11**. [Find key value](#u11-find-key-value)  
//**U12**. [Parse argument](#u12-parse-argument)  
//**U13**. [Process all <cmd> definitions](#u13-process-all-cmd-definitions)  
//**U14**. [Set input file path, file name, and extension](#u14-set-input-file-path-file-name-and-extension)  
//**U15**. [Color processor](#u15-color-processor)  
//**U16**. [Convert command array to string](#u16-convert-command-array-to-string)  
//**U17**. [Replace HTML text with text from package.json](#u17-replace-html-text-with-text-from-package-json)  
//**U18**. [Update about modal](#u18-update-about-modal)  
//**U19**. [Navigation bar functionality](#u19-navigation-bar-functionality)  
//**U20**. [Detect if in developer environment](#u20-detect-if-in-developer-environment)  
//**U21**. [Put all executables in dropdowns](#u21-put-all-executables-in-dropdowns)  
//**U22**. [Warn if identical data-argNames](#u22-warn-if-identical-data-argnames)  
//**U23**. [Put CLI help info in UGUI dev tools](#u23-put-cli-help-info-in-ugui-dev-tools)  
//**U24**. [Swap bootswatches](#u24-swap-bootswatches)  
//**U25**. [Save chosen bootswatch](#u25-save-chosen-bootswatch)  
//**U26**. [Custom keyboard shortcuts](#u26-custom-keyboard-shortcuts)  
//**U27**. [Launch links in default browser](#u27-launch-links-in-default-browser)  
//**U28**. [EZDZ: Drag and drop file browse box](#u28-ezdz-drag-and-drop)  
//**U29**. [Range slider](#u29-range-slider)  
//**U30**. [Cut/copy/paste context menu](#u30-cut-copy-paste-context-menu)  
//**U31**. [Save Settings](#u31-save-settings)  
//**U32**. [Load Settings](#u32-load-settings)  
//**U33**. [The UGUI Object](#u33-the-ugui-object)  







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U00. Intro
//

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

//This is the one place where the UGUI version is declared
var uguiVersion = "0.9.0";







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U01. UGUI Variables
//
//>Listing of Variables used throughout this library.

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
//`var cmdArgs = $("#argsForm *[data-argName]");`
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

//Name of the developer's application as a URL/Filepath safe name, set in package.json
var appName = packageJSON.name;

//The app title that is used dynamically throughout the UI and title bar, set in package.json
var appTitle = packageJSON.window.title;

//Version of the developer's application, set in package.json
var appVersion = packageJSON.version;

//Description or tagline for application, set in package.json
var appDescription = packageJSON.description;

//Name of the app developer or development team, set in package.json
var authorName = packageJSON.author;

//Name of the starting page for the app, set in package.json
var indexFile = packageJSON.main;

//You can stylize console outputs in WebKit, these are essentially CSS classes
var consoleNormal = "font-family: sans-serif";
var consoleBold   = "font-family: sans-serif;" +
                    "font-weight: bold";
var consoleCode   = "background: #EEEEF6;" +
                    "border: 1px solid #B2B0C1;" +
                    "border-radius: 7px;" +
                    "padding: 2px 8px 3px;" +
                    "color: #5F5F5F;" +
                    "line-height: 22px;" +
                    "box-shadow: 0px 0px 1px 1px rgba(178,176,193,0.3)";

//Placing this at the start of a console output will let you style it
//**Example**: `console.info(ͼ+"Some bold text.", consoleBold);`
var ͼ = "%c";

//Make sure the ugui and ugui.args objects exist, if not create them
if (!window.ugui) {
    window.ugui = {};
    window.ugui.args = {};
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U02. Read a file
//
//>A function that allows you to set the contents of a file to
// a variable. Like so:
//
//>`var devToolsHTML = readAFile("_markup/ugui-devtools.htm");`

//
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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U03. Run CMD
//
//>This is what makes running your CLI program and arguments
// easier. Cow & Taco examples below to make life simpler.
//>
//
//>     $("#taco").click( function() {
//         runcmd('pngquant --force "file.png"');
//     });
//
//>     runcmd("node --version", function(data) {
//         $("#cow").html("<pre>Node Version: " + data + "</pre>");
//     });

//
function runcmd(executableAndArgs, callback) {
    //Validate that the required argument is passed
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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U04. Run CMD (Advanced)
//
//>This is a more advanced option for running executables. You
// can pass in a parameters object to get additional
// functionality such as running a function when an executable
// closes, finishes, errors, or returns data.
//
//>`ugui.helpers.runcmdAdvanced(parameters);`
//
//>Below is an example parameters object.
//
//>     var parameters = {
//         "executableAndArgs": "node --version",
//         "returnedData": function(data) {
//             console.log("The text from the exectuable: " + data);
//         },
//         "onExit": function(code) {
//             console.log("Executable finished with the exit code: " + code);
//         },
//         "onError": function(err) {
//             console.log("Executable finished with the error: " + err);
//         },
//         "onClose": function(code) {
//             console.log("Executable has closed with the exit code: " + code);
//         }
//     }

//
function runcmdAdvanced(parameters) {
    //Validate that required argument is passed
    if (!parameters) {
        console.info("You must pass in an object with your options.");
        console.info("Example:");
        console.info("    var parameters = { 'executableAndArgs': 'node --version' };");
        console.info("    ugui.helpers.runcmdAdv(parameters);");
        return;
    }
    //Validate types
    if (Object.prototype.toString.call(parameters) !== "[object Object]") {
        console.info("Your parameters must be passed as an object.");
        return;
    } else if (typeof(parameters.executableAndArgs) !== "string") {
        console.info("Executable and arguments must be passed as a string.");
        console.info('Example: "node --version"');
        return;
    } else if (parameters.returnedData && typeof(parameters.returnedData) !== "function") {
        console.info("returnedData must be a function.");
        return;
    } else if (parameters.onExit && typeof(parameters.onExit) !== "function") {
        console.info("onExit must be a function.");
        return; 
    } else if (parameters.onError && typeof(parameters.onError) !== "function") {
        console.info("onError must be a function.");
        return;
    } else if (parameters.onClose && typeof(parameters.onClose) !== "function") {
        console.info("onClose must be a function.");
        return;
    }

    var exec = require("child_process").exec;
    var child = exec( parameters.executableAndArgs,
        //Throw errors and information into console
        function(error, stdout, stderr) {
            console.log(parameters.executableAndArgs);
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
            if (error !== null) {
                console.log("Executable Error: " + error);
            } else {
                return child;
            }
            console.log("---------------------");
        }
    );

    //Detect when executable finishes
    child.on("exit", function(code) {
        if (typeof parameters.onExit === "function") {
            parameters.onExit(code);
        }
    });

    //Detect when executable errors
    child.on("error", function(code) {
        if (typeof parameters.onError === "function") {
            parameters.onError(code);
        }
    });

    //Detect when the executable is closed
    child.on("close", function(code) {
        if (typeof parameters.onClose === "function") {
            parameters.onClose(code);
        }
    });

    //Return data from command line
    child.stdout.on("data", function(chunk) {
        if (typeof parameters.returnedData === "function") {
            parameters.returnedData(chunk);
        }
    });
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U05. Prevent user from entering quotes in forms
//
//>In all input text fields and textareas, remove both single
// and double quotes as they are typed, on page load, and when
// the form is submitted.

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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U06. Submit locked until required fulfilled
//
//>Gray out the submit button until all required elements are
// filled out. On every change, click, or keystroke, check all
// forms to verify that if any need unlocked or locked.

//
function unlockSubmit() {
    //Cycle through each executable
    for (index = 0; index < executable.length; index++) {
        //Get the current executable
        var currentExecutable = executable[index];
        //If a required element wasn't filled out in this form
        if ( $("#" + currentExecutable).is(":invalid") ) {
            //Disable/Lock the submit button
            $("#" + currentExecutable + " .sendCmdArgs").prop("disabled", true);
        //If all required elements in a form have been fulfilled
        } else {
            //Enable/Unlock the submit button
            $("#" + currentExecutable + " .sendCmdArgs").prop("disabled", false);
        }
    }

}

for (index = 0; index < argsForm.length; index++) {
    //When you click out of a form element
    $(argsForm[index]).keyup  ( unlockSubmit );
    $(argsForm[index]).mouseup( unlockSubmit );
    $(argsForm[index]).change ( unlockSubmit );
}

//On page load have this run once to unlock submit if nothing is required.
unlockSubmit();







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U07. Realtime updating dev tool command output
//
//>This updates the contents the UGUI Developer Toolbar's
// "CMD Output" section whenever the user interacts with any
// form elements.

//Make sure we're in dev mode first
if( $("body").hasClass("dev") ) {

    //Cycle through all executables used by the app
    for (index = 0; index < executable.length; index++) {
        //If any of the form elements with a data-argName change
        $(argsForm[index]).change( function() {
            //check if it was the drag/drop input box
            if ( $(this).parent().hasClass("ezdz") ) {
                var file = this.files[0];
                //run a custom function before updating dev tools
                ezdz(file);
            }

            //Update the UGUI Developer Toolbar's "CMD Output" section
            updateUGUIDevCommandLine();
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

    //Replace the text in the "CMD Output" section of the UGUI Developer Toolbar
    $("#commandLine").html( devCommandOutputSpaces );
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U08. Clicking Submit
//
//>What happens when you click the submit button.
//
//>When the button is pressed, prevent it from submitting the
// form like it normally would in a browser. Detect which form
// the submit button is in and what executable it corresponds
// to. Remove quotes from all fields. Build the command line
// array based on UGUI Args Object and turn it into a string.
//
//>Detect if text from the command line is meant to be printed
// on the page. Then run the command.

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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U09. Building the Command Array
//
//>What happens when you click the submit button or when the
// UGUI Developer Toolbar's "CMD Output" section is updated to
// preview the outputted command that would be sent to the
// command line/terminal.

//
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

    //fill out `window.ugui.args` object
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
        //`cmdArgsText[index]` is "--quality ((meow)) to ((oink.min))"
        cmds.push( parseArgument(cmdArgsText[index]) );
    }

    //After all the processing is done and the array is built, return it
    return cmds;
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U10. Build UGUI Arg Object
//
//>This grabs all the data about the elements on the page that
// have a data-argName and puts that information on the window
// object, located here: `window.ugui.args`

//
function buildUGUIArgObject() {
    //Reset the Args Object to remove any stragglers
    window.ugui.args = {};

    //Make an array containing every element on the page with an attribute of `data-argName`
    var cmdArgs = $("*[data-argName]");

    //Cycle through all elements with a `data-argName` in `<form id="currentexecutable">`
    for (index = 0; index < cmdArgs.length; index++) {

        //get "bob" from `<input data-argName="bob" value="--kitten" />`
        var argName = $(cmdArgs[index]).attr("data-argName");

        //Declare some variables to be set later
        var argValue = "";
        var argType = "";

        //See if the current item is a range slider
        if ( $(cmdArgs[index]).hasClass("slider") ) {
            //get "6" from `<input data-argName="bob" value="6" type="text" class="slider" />`
            argValue = $(cmdArgs[index]).val();

            //manually set the type to "range" for range slider elements
            argType = "range";
        //See if the element is an item in one of Bootstrap's fake dropdowns
        } else if ( $(cmdArgs[index]).parent().parent().hasClass("dropdown-menu") ) {

            //get "--carrot" from `<input type="radio" data-argName="vegCarrot" value="--carrot" />`
            argValue = $(cmdArgs[index]).val();

            //manually set the type to "range" for range slider elements
            argType = "dropdown";
        } else {
            //get "--kitten" from `<input data-argName="bob" value="--kitten" />`
            argValue = $(cmdArgs[index]).val();

            //get checkbox from `<input data-argName="bob" type="checkbox" />`
            argType = $(cmdArgs[index]).attr("type");
        }

        //get input from `<input data-argName="bob" type="checkbox" />`
        var argTag = $(cmdArgs[index]).prop("tagName").toLowerCase();

        //Basic info put on every object
        window.ugui.args[argName] = {
            "value": argValue,
            "htmltag": argTag,
            "htmltype": argType
        };

        //Special info just for `<input type="file">`
        if (argType === "file") {
            setInputFilePathNameExt(cmdArgs[index], argName);
            window.ugui.args[argName].htmltag = argTag;
            window.ugui.args[argName].htmltype = argType;
        }

        //Special info just for `<input type="color">`
        if (argType === "color") {
            colorProcessor(argValue, argName);
            window.ugui.args[argName].htmltag = argTag;
            window.ugui.args[argName].htmltype = argType;
        }

        //For checkboxes and radio dials, add special info
        if (argType === "checkbox" || argType === "radio" || argType === "dropdown") {
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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U11. Find Key Value
//
//>This is a general purpose function that allows retrieving
// information from an object. Here is an example object and
// how `findKeyValue()` works to return data from it:
//
//>     var a = {
//         "b": "dog",
//         "c": {
//             "d": "cat",
//             "e": "bat"
//         }
//     };
//     var ab  = ["b"];
//     var acd = ["c","d"];
//
//>     console.log( findKeyValue(a,ab) );  //dog
//     console.log( findKeyValue(a,acd) ); //cat

//
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

    /* console.log(obj, arr); */
    for (var i = 0; i < arr.length; i++) {
        obj = obj[arr[i]];
    }
    //For stuff like ((moo)), assume the user means ((moo.value))
    if (Object.prototype.toString.call(obj) === "[object Object]") {
        obj = obj.value;
    }
    /* console.log(obj); */
    return obj;
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U12. Parse Argument
//
//>This takes the argument from the `<cmd><arg>`, finds all
// the `((keywords))` and replaces them with the information on
// the UGUI Args Object found here: `window.ugui.args`

//
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

    //`argumentText = "and ((meow)), with ((oink)) too. "`
    var regexToMatch = /\(\((.*?)\)\)/;

    //Keep rerunning this until all ((keywords)) in argumentText are replaced with their actual values
    while ( regexToMatch.test(argumentText) ) {

        //`match = ["((meow))","meow"]`
        var match = regexToMatch.exec(argumentText);
        var uguiArgObj = window.ugui.args;

        var regExMatch = RegExp( "\\(\\(" + match[1] + "\\)\\)" );
        //`matched = uguiArgObj.meow`
        var matched = uguiArgObj[match[1]];

        if (matched === undefined) {
            var matchName = match[1].split(".")[0];
            matched = uguiArgObj[matchName];
        }

        /* console.log( "-----------------" ); */
        /* console.log( "value: ", matched.value ); */

        //Skip all unchecked checkboxes and unchecked radio dials.
        //Skip everything without a value
        if (
            (matched.htmltype === "checkbox" && matched.htmlticked === false) ||
            (matched.htmltype === "radio" && matched.htmlticked === false) ||
            (matched.htmltype === "dropdown" && matched.htmlticked === false) ||
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

    /* console.log(argumentText); */

    }

    return argumentText;
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U13. Process All CMD Definitions
//
//>This loops through all <def>'s and processes the value of
// them to create the correct key value pairs on the UGUI Args
// Object.

//
function patternMatchingDefinitionEngine() {
    //A regular expression that matches ((x)) and captures x
    var re = /\(\((.*?)\)\)/gi;

    $("def").each(function(index, value) {
        //Assign "value" to def
        //`def = <def name="quality">((min)),((max))</def>`
        var def = value;

        //Get the actual definition from the def
        //`definition = "((min)),((max))"`
        var definition = $("def").html();

        //Get the arg associated with this def
        //`arg = ugui.args.quality`
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
        //`argValue = "0,75"`
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
                arg[args[i]] = argValue.slice(
                    (argValue.indexOf(firstSeperator, splitIndex) + firstSeperator.length),
                    argValue.indexOf(secondSeperator, (splitIndex + firstSeperator.length))
                );
                splitIndex = argValue.indexOf(secondSeperator, (splitIndex + firstSeperator.length))
            }
        }
    })
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U14. Set input file path, file name, and extension
//
//>This processes elements with a data-argName that are
// `<input type="file">`. It creates special properties for the
// element and places them on the UGUI Args Object found here:
// `window.ugui.args`

//
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

        //If you're on windows then folders in filepaths are separated with `\`, otherwise OS's use `/`
        if ( platform == "win32" ) {
            //Get the index of the final backslash so we can split the name from the path
            var lastBackslash = fullFilepath.lastIndexOf("\\");
            // `C:\users\bob\desktop\`
            filepath = fullFilepath.substring(0, lastBackslash+1);
        } else {
            //Get the index of the final backslash so we can split the name from the path
            var lastSlash = fullFilepath.lastIndexOf("/");
            // `/home/bob/desktop/`
            filepath = fullFilepath.substring(0, lastSlash+1);
        }

        //Split `"cows.new.png"` into `["cows", "new", "png"]`
        var filenameSplit = filename.split(".");
        //Remove last item in array, `["cows", "new"]`
        filenameSplit.pop();
        //Combine them back together as a string putting the . back in, `"cows.new"`
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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U15. Color Processor
//
//>Process input elements with a type of color to generate
// RGB, Hex, and Decimal values, then place them on the
// `ugui.args.{data-argName}` object.

//
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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U16. Convert Command Array to string
//
//>Take the array of executable and commands, remove empty
// arguments and put everything into a string to be sent out
// to the command line.

//
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

    //`cmdArray = ["cli_filename", "", "", "-nyan", "--speed 1mph", "", "", "-pear", "--potato", "", "", "", "-m "Text"", ""C:\Users\jwilcurt\Desktop\IICL Stuff.new.png""]`
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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U17. Replace HTML text with text from package.json
//
//>Some text on the page can be auto-filled from the content in
// the package.json. This replaces the text on the page.

//
$(".applicationName").html(appTitle);
$(".applicationTitle").html(appTitle);
$(".applicationDescription").html(appDescription);
getAboutModal();






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U18. Update About modal
//
//>This pulls in information about the application from the
// package.json file and puts in in the About modal. It also
// pulls in UGUI's about info from the `_markdown` folder.

//
function getAboutModal() {
    $.get("_markup/ugui-about.htm", function( aboutMarkup ) {
        //Put UGUI about info in about modal
        $("#aboutModal .modal-body").append( aboutMarkup );

        //Wait for the "UGUI about" info to be loaded before updating the "App about" section
        //Load application name, version number, and author from package.json
        $(".applicationName").html(appTitle);
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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U19. Navigation bar functionality
//
//>Everything in this section controls the visibility and the
// functionality of the items in the top nav bar.

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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U20. Detect if in Developer environment
//
//>Detects if you're in Development or Production environment.
//
//>If you have a class of "dev" or "prod" in the `body` tag
// UGUI will enable key bindings such as `F12` or
// `CTRL+Shift+I` to launch Webkit's Developer Tools, or `F5`
// to refresh. Also it displays the Command Line output at the
// bottom of the page.


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
    $("#commandLine").html(
        '<span class="commandLineHint">Click the <em>' +
        $('#' + commandLineOutputExecutable + ' .sendCmdArgs').html() +
        '</em> button to see output.</span>'
    );
}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U21. Put all executables in dropdowns
//
//>In the UGUI Developer Toolbar, there are dropdowns in the
// "CMD Output" and "Executable Info" sections that contain all
// of the executables used in the app.

//
function fillExecutableDropdowns() {
    //check each file and put it in the dropdown box
    for (index = 0; index < executable.length; index++) {
        $(".executableName").append('<option value="' + executable[index] + '">' + executable[index] + '</option>');
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U22. Warn if identical data-argNames
//
//>If the developer uses the same data-argName value for
// multiple elements, display a warning.

//
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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U23. Put CLI help info in UGUI Dev Tools
//
//>This funciton is only ran when in dev mode. It adds another
// tab in the UGUI Developer Tools that returns information
// from the user's executable with arguments like `--help`.

//
function putExeHelpInDevTools() {
    //Everytime the dropdown changes update the `<pre>`
    $("#uguiDevTools .executableName").change(getHelpInfo);
    $("#uguiDevTools .helpDropdown").change(getHelpInfo);

    function getHelpInfo() {
        //Grab the correct executable from the dropdown
        var executableChoice = $(".uguiExecutable .executableName").val();
        //Grab which kind of help argument they chose, like `--help` or `/?`
        var helpChoice = $(".uguiExecutable .helpDropdown").val();

        //Don't run if there isn't a help choice
        if (helpChoice) {
            //Run the executable using the user's chosen argument to get it's help info
            runcmd( executableChoice + " " + helpChoice, function(returnedHelpInfo) {
                //Put the help info in a `<pre>`
                $("#uguiDevTools pre.executableHelp").text( returnedHelpInfo );
            });
        }
    }
}







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U24. Swap Bootswatches
//
//>This funciton is only ran when in dev mode. It grabs a list
// of all files in the `ven.bootswatch` folder and puts them in
// a dropdown box in UGUI Developer Toolbar so developers can
// try out different stylesheets.

//
function swatchSwapper() {
    //Grab all the files in the `ven.bootswatch` folder and put them in an array
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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U25. Save chosen Bootswatch
//
//>In the "Style Swapper" section of UGUI Developer Toolbar,
// when the user clicks the "Use this style" button,
// read the contents of the index.htm, find the line that sets
// which swatch css to use and update it to the new chosen
// swatch. Then replace the contents of index.htm with the new
// data so on every load it uses the correct swatch.

//
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

        //would match: `<link rel="stylesheet" href="_style/ven.bootswatch/cerulean.min.css" data-swatch="swapper">`
        var createRegex = RegExp(re_start + re_file + re_end, ["i"]);
        var findSwatchLine = createRegex.exec(data);
        //If we could find the line in the file
        if (findSwatchLine != null) {
            //Though not currently using this line, it may come in handy some day
            //`var currentSwatch = findSwatchLine[52];`

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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U26. Custom keyboard shortcuts
//
//>This funciton is only ran when in dev mode. It gives the
// developer access to common/expected keyboard shortcuts.

//
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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U27. Launch links in default browser
//
//>Detects all links on the page with a class of `external-link`
// and sets them to open the link in the user's default browser
// instead of using NW.js as a browser which can cause issues.

//
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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U28. EZDZ: Drag and Drop
//
//>Code for drag/drop/browse box. This was originally based on
// EZDZ, but has been heavily modified for Bootstrap and NW.js
// for cross-platform and Bootswatch compatibility.
//
//>After dropping a file in the EZDZ box, put the file name in
// the EZDZ box. If the file is an image, display a thumbnail.
//
//>**Credits:** [EZDZ on GitHub](https://github.com/jaysalvat/ezdz)

//
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
        //var reader = new FileReader(file);

        //reader.readAsDataURL(file);

        //reader.onload = function(event) {
            //var data = event.target.result;
            //var $img = $("<img />").attr("src", data).fadeIn();
            var $img = $("<img />").attr("src", file.path).fadeIn();

            $(".ezdz img").attr("alt", "Thumbnail of dropped image.");
            $(".ezdz span").html($img);
        //};
    }

    //Update the text on screen to display the name of the file that was dropped
    var droppedFilename = file.name + " selected";
    $(".ezdz label").html(droppedFilename);

}






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U29. Range slider
//
//>Enables all elements with a class of `slider` to use the
// boostrap-slider plugin.
//
//>**Documentation**: [http://seiyria.github.io/bootstrap-slider](http://seiyria.github.io/bootstrap-slider)

//Initialize the bootstrap-slider plugin for all elements on the page with a class of `slider`
$(".slider").slider({
    formatter: function(value) {
        return value;
    }
});

//Since bootstrap-slider is a plugin and not officially part of Bootstrap,
//bootswatches don't contain styles for them. So we manually set the styles.
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







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U30 Cut/Copy/Paste context menu
//
//>Right-click on any text or text field and you can now C&P!
//
//>**Credit**: [nw-contextmenu on GitHub](https://github.com/b1rdex/nw-contextmenu)

//
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






//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U31. Save settings
//
//>This saves the settings of your app into a local user
// account specific folder on the computer that is different
// for each Operating System. You can run the following to see
// what the default location is on your OS:
//
//>`ugui.helpers.saveSettings(["Show Default"]);`
//
//>Or you can pass in a custom path for the location of your
// settings file. Add `data-argName` to an element in your HTML
// to ensure it gets saved automatically.
//
//>Add a class of `do-not-save` for items you don't want to be
// updated during `loadSettings()`

//
function saveSettings(customLocation, callback) {
    var gui = require("nw.gui");

    var defaultLocation = "";

    //If you're on windows then folders in filepaths are separated with `\`, otherwise OS's use `/`
    if ( process.platform == "win32" ) {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + "\\uguisettings.json");
    } else {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + "/uguisettings.json");
    }

    //If a custom location isn't passed into the function, use the default location for the settings file
    var settingsFile = defaultLocation;

    //Validate types
    //Check if only one argument was passed into `saveSettings` and if it was a string or function
    //Check if two arguments were passed into `saveSettings` and if the first one is a string, OR
    //Check if two arguments were passed into `saveSettings` and if the second one is a function
    if (
        (arguments.length === 1 && (typeof(customLocation) !== "string") && (typeof(customLocation) !== "function")) ||
        (arguments.length === 2 && typeof(customLocation) !== "string") ||
        (arguments.length === 2 && typeof(callback) !== "function")
       ) {
        console.info(ͼ+"The following arguments are allowed:", consoleBold);
        console.info(ͼ+"1. Just a string to a custom file path.", consoleNormal);
        console.info(ͼ+'ugui.helpers.saveSettings( "C:\\folder\\app-settings.json" );', consoleCode);
        console.info(ͼ+"2. Just a function as a callback to be ran when save completes.", consoleNormal);
        console.info(ͼ+'ugui.helpers.saveSettings( function(){console.log("Saved.")} );', consoleCode);
        console.info(ͼ+"3. A string followed by a function, as a custom path and callback upon completion.", consoleNormal);
        console.info(ͼ+'ugui.helpers.saveSettings( "C:\\folder\\app-settings.json", function(){console.log("Saved.")} );', consoleCode);
        console.info(ͼ+"4. Nothing at all.", consoleNormal);
        console.info(ͼ+'ugui.helpers.saveSettings();', consoleCode);
        console.info(ͼ+"By passing in nothing, UGUI will use the default save location of:", consoleNormal);
        console.info(ͼ+'"' + defaultLocation + '"', consoleCode);
        console.info(ͼ+"And upon completion of saving the settings, nothing will be triggered.", consoleNormal);
        return;
    //Check if customLocation is exists and is a string
    } else if ( customLocation && typeof(customLocation) === "string") {
        //Set the settings file to the custom, passed in, location
        settingsFile = customLocation;
    }

    //Make sure args object is up to date
    window.ugui.helpers.buildUGUIArgObject();

    //Grab the args object and JSONify it
    var settingsJSON = JSON.stringify(ugui.args);

    //Save the ugui.args object to the `uguisettings.json` file
    //fs.writeFileSync();
    fs.writeFile(settingsFile, settingsJSON, function (err) {
        if (err) {
            console.warn("There was an error in attempting to save to the location:");
            console.warn(settingsFile);
            console.warn("Error: " + err);
        } else {
            //If a callback function was passed into `saveSettings`, run it
            if (typeof(callback) === "function") {
                callback();
            } else if (typeof(customLocation) === "function") {
                customLocation();
            }
        }
    });
}

//Make sure anything is a class of `save-ugui-settings` is wired up to save the UGUI settings
$(".save-ugui-settings").click( function() {
    saveSettings();
} );







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U32. Load settings
//
//>This loads your settings from the default save location or
// a location that you've passed in. It reads the file, which
// is a JSON version of the `ugui.args` object, and updates
// the UI elements on the page with the correct values, then
// updates the current `ugui.args` to reflect the UI changes.
//
//>To have an HTML element skipped during the load process,
// give it a class of `do-not-save`.

//
function loadSettings(customLocation, callback) {
    var gui = require("nw.gui");

    var defaultLocation = "";

    //If you're on windows then folders in filepaths are separated with `\`, otherwise OS's use `/`
    if ( process.platform == "win32" ) {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + "\\uguisettings.json");
    } else {
        //Find the path to the settings file and store it
        defaultLocation = (gui.App.dataPath + "/uguisettings.json");
    }

    //If a custom location isn't passed into the function, use the default location for the settings file
    var settingsFile = defaultLocation;

    //Validate types
    //Check if only one argument was passed into `loadSettings` and if it was a string or function
    //Check if two arguments were passed into `loadSettings` and if the first one is a string, OR
    //Check if two arguments were passed into `loadSettings` and if the second one is a function
    if (
        (arguments.length === 1 && (typeof(customLocation) !== "string") && (typeof(customLocation) !== "function")) ||
        (arguments.length === 2 && typeof(customLocation) !== "string") ||
        (arguments.length === 2 && typeof(callback) !== "function")
       ) {
        console.info(ͼ+"The following arguments are allowed:", consoleBold);
        console.info(ͼ+"1. Just a string to a custom file path.", consoleNormal);
        console.info(ͼ+'ugui.helpers.loadSettings( "C:\\folder\\app-settings.json" );', consoleCode);
        console.info(ͼ+"2. Just a function as a callback to be ran when loading completes.", consoleNormal);
        console.info(ͼ+'ugui.helpers.loadSettings( function(){console.log("loaded.")} );', consoleCode);
        console.info(ͼ+"3. A string followed by a function, as a custom path and callback upon completion.", consoleNormal);
        console.info(ͼ+'ugui.helpers.loadSettings( "C:\\folder\\app-settings.json", function(){console.log("loadd.")} );', consoleCode);
        console.info(ͼ+"4. Nothing at all.", consoleNormal);
        console.info(ͼ+'ugui.helpers.loadSettings();', consoleCode);
        console.info(ͼ+"By passing in nothing, UGUI will use the default load location of:", consoleNormal);
        console.info(ͼ+'"' + defaultLocation + '"', consoleCode);
        console.info(ͼ+"And upon completion of saving the settings, nothing will be triggered.", consoleNormal);
        return;
    //Check if customLocation is exists and is a string
    } else if ( customLocation && typeof(customLocation) === "string") {
        //Set the settings file to the custom, passed in, location
        settingsFile = customLocation;
    }

    //Attempt to read the file
    fs.readFile(settingsFile, {encoding: "utf-8"}, function(err, data){
        //Display console warning if unable to read the file
        if (err) {
            console.warn("Could not read settings file from location:");
            console.warn('"' + settingsFile + '"');
            return;
        //Load the file if it's found
        } else {
            var settingsObj = JSON.parse(data);
            //Iterate through the saved settings and update the UI
            for (key in settingsObj) {
                var htmltype = settingsObj[key].htmltype;
                var htmlticked = settingsObj[key].htmlticked;

                //Check if the key has a corresponding UI element
                //and that it isn't set to 'do not save'
                if ( $("[data-argName" + key + "]") && !($("[data-argName" + key + "]").hasClass("do-not-save")) ) {
                    /* console.log(htmltype); */
                    //If `<input type="file">` and it has value
                    if (htmltype == "file" && settingsObj[key].value !== "") {
                        //Create an object with the correct file properties
                        var file = {
                            "type": settingsObj[key].type,
                            "path": settingsObj[key].fullpath,
                            "name": settingsObj[key].nameExt,
                            "size": settingsObj[key].size,
                            "lastModified": settingsObj[key].lastModified,
                            "lastModifiedDate": settingsObj[key].lastModifiedDate,
                            "webkitRelativePath": settingsObj[key].webkitRelativePath
                        };
                        //Set the matching UI element in the app with the above properties
                        $("[data-argName=" + key + "]")[0].files[0] = file;

                        //Update EZDZ if the element is using it
                        if ( $("[data-argName=" + key + "]").parent().hasClass("ezdz") ) {
                            //Run EZDZ to update visuals on the page
                            ezdz(file);
                        }
                    //If `<input type="checkbox">` or `<input type="radio">`
                    } else if ( htmltype == "checkbox" || htmltype == "radio") {
                        //Set the value of the element as checked or not
                        if (htmlticked == true) {
                            $("[data-argName=" + key + "]").prop("checked", true);
                        } else {
                            $("[data-argName=" + key + "]").prop("checked", false);
                        }
                    //If the setting is for a radio in one of Bootstrap's fake dropdowns
                    } else if (htmltype == "dropdown" && htmlticked == true) {
                        //Force the UI to be updated
                        $("[data-argName=" + key + "]").trigger("click");
                    //If the setting is for a range slider
                    } else if (htmltype == "range") {
                        //Check if the value is not a number, like `'0,25'` rather than `2`
                        if (isNaN(settingsObj[key].value)) {
                            //Split `0,25` into `0` and `25` and return them as numbers instead of strings
                            var parsedValue = settingsObj[key].value.split(",").map( function(num) {
                                return parseInt(num);
                            });
                            //Set the value to `0,25` and the data-slider-value to `[0,25]`
                            $("[data-argName=" + key + "]").slider("setValue", parsedValue);
                            $("[data-argName=" + key + "]").attr("data-slider-value", "[" + parsedValue + "]");
                        } else {
                            //Set the value to `2`
                            $("[data-argName=" + key + "]").slider("setValue", parseInt(settingsObj[key].value));
                        }
                    //If `<textarea>`
                    } else if (htmltype == "textarea") {
                        //Set the value and UI text for the matching textarea in the app
                        $("[data-argName=" + key + "]").val(settingsObj[key].value);
                        $("[data-argName=" + key + "]").text(settingsObj[key].value);
                    //Catch-all for any generic other input types
                    } else if (settingsObj[key].value) {
                        //set the value for the matching element
                        $("[data-argName=" + key + "]").val(settingsObj[key].value);
                    }
                }
            }

            //Build the arg object based on our updated UI
            removeTypedQuotes();
            buildUGUIArgObject();
            patternMatchingDefinitionEngine();

            //Update the UGUI Developer Toolbar and unlock/lock sumbit buttons accordingly
            updateUGUIDevCommandLine();
            unlockSubmit();

            //If a callback function was passed into `saveSettings`, run it
            if (typeof(callback) === "function") {
                callback();
            } else if (typeof(customLocation) === "function") {
                customLocation();
            }
        }
    });
}

//Make sure anything is a class of `load-ugui-settings` is wired up to load the UGUI settings
$(".load-ugui-settings").click( function() {
    loadSettings();
});







//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//### U33. The UGUI Object
//
//>We expose parts of UGUI to developers via the UGUI object.
// To quickly access what is available type "ugui" into the
// NW.js (Webkit) Developer Tools console.

//
window.ugui = {
    "allArgElements": allArgElements,
    "app": {
        "author": authorName,
        "description": appDescription,
        "name": appName,
        "packageJSON": packageJSON,
        "startPage": indexFile,
        "title": appTitle,
        "version": appVersion,
    },
    "args": window.ugui.args,
    "executable": executable,
    "helpers": {
        "buildCommandArray": buildCommandArray,
        "buildUGUIArgObject": buildUGUIArgObject,
        "centerNavLogo": centerNavLogo,
        "convertCommandArraytoString": convertCommandArraytoString,
        "fillExecutableDropdowns": fillExecutableDropdowns,
        "findKeyValue": findKeyValue,
        "loadSettings": loadSettings,
        "openDefaultBrowser": openDefaultBrowser,
        "parseArgument": parseArgument,
        "patternMatchingDefinitionEngine": patternMatchingDefinitionEngine,
        "readAFile": readAFile,
        "removeTypedQuotes": removeTypedQuotes,
        "runcmd": runcmd,
        "runcmdAdvanced": runcmdAdvanced,
        "saveSettings": saveSettings,
        "sliderHandleSolid": sliderHandleSolid,
        "sliderHandleGradient": sliderHandleGradient,
        "sliderHandleColor": sliderHandleColor,
        "updateCommandLineOutputPreviewHint": updateCommandLineOutputPreviewHint,
        "updateUGUIDevCommandLine": updateUGUIDevCommandLine,
        "warnIfDuplicateArgNames": warnIfDuplicateArgNames
    },
    "platform": process.platform,
    "textFields": textFields,
    "version": uguiVersion
};







// end `ugui();`
}







/***********************************************************************/
/*                                                                     */
/*  /////////////////////////////////////////////////////////////////  */
/*  //                                                             //  */
/*  //                    ANNOTATED SOURCE CODE                    //  */
/*  //                                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  // 1. Introduction                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  //                                                             //  */
/*  // This document's comments have been written specifically     //  */
/*  // with MarkDown and Docco in mind. Markdown is a simple way   //  */
/*  // to add formatting to text that can then be converted to     //  */
/*  // HTML. It is used by sites like GitHub, StackOverflow, and   //  */
/*  // Reddit. Since the UGUI project is hosted on GitHub and it's //  */
/*  // community is based in ugui.reddit.com, it seemed logical    //  */
/*  // MarkDown be the common language used for the documentation. //  */
/*  // Fortunately Jeremy Ashkenas created a tool called Docco     //  */
/*  // that allows you to easily generate an HTML file from your   //  */
/*  // source files.                                               //  */
/*  //                                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  // 2. Running Docco/Updating the documentation                 //  */
/*  /////////////////////////////////////////////////////////////////  */
/*  //                                                             //  */
/*  // These instructions will be updated when a more routine      //  */
/*  // method is developed.                                        //  */
/*  //                                                             //  */
/*  /////////////////////////////////////////////////////////////////  */
/*                                                                     */
/***********************************************************************/
