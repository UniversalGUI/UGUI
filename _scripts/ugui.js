
//Wait for the document to load before running ugui.js
$(document).ready( runUGUI );







//Container for all UGUI components
function runUGUI() {

var uguiVersion = "0.9.0";







/////////////////////////////////////////////////////////////////
//                                                             //
//                        UGUI VARIABLES                       //
//                                                             //
/////////////////////////////////////////////////////////////////
// Listing of Variables used throughout this library.          //
/////////////////////////////////////////////////////////////////

//All arguments sent in the command
var allArgElements = $("command arg");

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
var textFields = $( "#argsForm textarea[data-argName], #argsForm input[data-argName][type=text]" ).toArray();

//Access the contents of the package.json file
var packageJSON = require('nw.gui').App.manifest;

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

//Make sure the ugui and ugui.args objects exist, if not create them
if (!window.ugui) {
    window.ugui = {};
    window.ugui.args = {};
}







/////////////////////////////////////////////////////////////////
//                                                             //
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
    var fs = require("fs");
    var fileData = fs.readFileSync(filePathAndName, {encoding: "UTF-8"});
    return fileData;
}







/////////////////////////////////////////////////////////////////
//                                                             //
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
// runcmd('node --version', function(data) {                   //
//   $("#cow").html("<pre>Node Version: " + data + "</pre>");  //
// });                                                         //
//                                                             //
/////////////////////////////////////////////////////////////////

function runcmd(executableAndArgs, callback) {
    var exec = require("child_process").exec;
    var child = exec( executableAndArgs,
        //Throw errors and information into console
        function(error, stdout, stderr) {
            console.log(executableAndArgs);
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('Executable Error: ' + error);
            }
            console.log("---------------------");
        }
    );
    //Return data from command line
    child.stdout.on("data", function(chunk) {
        if (typeof callback === "function"){
            callback(chunk);
        }
    });
}







/////////////////////////////////////////////////////////////////
//                                                             //
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
   var spawn = require("child_process").spawn;
   console.log( executable, args );
   var child = spawn( executable, args );
   child.stdout.on("data", function(chunk) {
       if (typeof callback === "function"){
           callback(chunk);
       }
   });

   child.stderr.on("data", function(data) {
     console.log("stderr: " + data);
   });
}







/////////////////////////////////////////////////////////////////
//                                                             //
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
//                                                             //
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
$('.sendCmdArgs').each( unlockSubmit );







/////////////////////////////////////////////////////////////////
//                                                             //
//          REALTIME UPDATING DEV TOOL COMMAND OUTPUT          //
//                                                             //
/////////////////////////////////////////////////////////////////
// In the UGUI Dev Tools there is a Command Output tab. This   //
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
    //Give the UGUI Dev tools the first executable for now
    var thisExecutable = executable[0];
console.log(thisExecutable);
    //Get an array of all the commands being sent out
    var devCommandOutput = buildCommandArray(thisExecutable);
    var devCommandOutputSpaces = [];

    for (index = 0; index < devCommandOutput.length; index++) {
        devCommandOutputSpaces.push(" " + devCommandOutput[index]);
    }

    //Replace the text in the command line box in UGUI dev tools
    $("#commandLine").html( devCommandOutputSpaces );
}







/////////////////////////////////////////////////////////////////
//                                                             //
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

//When you click the Compress button.
$(".sendCmdArgs").click( function(event) {

    //Get the correct executable to use based on the form you clicked on
    var thisExecutable = $(this).closest(form).attr("id");

    //Prevent the form from sending like a normal website.
    event.preventDefault();

    //Remove all single/double quotes from any text fields
    removeTypedQuotes();

    //Create an array with the executable and all the arguments then run the executable with those args
    runcmd( buildCommandArray(thisExecutable) );

});

function buildCommandArray(thisExecutable) {
    //Set up commands to be sent to command line
    var cmds = [ thisExecutable ];

    putElementValuesInArgObj();

    var argsForm = $("#" + thisExecutable);
console.log(argsForm);
    //Cycle through all DOM Arguments
    for (index = 0; index < allArgElements.length; index++) {

        //get "bob" from <arg name="bob">((value))</arg>
        var argName = $(allArgElements[index]).attr("name");
        //find the form element with the same argName
        var matchingFormElement = $("#argsForm *[data-argName=" + argName + "]");

        //get "input" from <input type="text">
        //var formTag = $(matchingFormElement).prop("tagName");
        //    formTag = formTag.toLowerCase();

        //get "text" from <input type="text">
        var formElementType = $(matchingFormElement).attr("type");
        //get "22" from <textarea>22</textarea>
        var formElementValue = $(matchingFormElement).val();

        //detect if the current form element is a radio dial or checkbox
        var formElementRadioCheckbox = "";
        if (formElementType === "checkbox" || formElementType === "radio") {
            formElementRadioCheckbox = $(matchingFormElement);
        }

        //get "--speed ((value))" from <arg name="quality">--speed ((value))</arg>
        var argCommand = $(allArgElements[index]).text();

        //replace the ((value)) with 22
        if ( argCommand.indexOf("((value))") !== -1 ) {
            argCommand = argCommand.replace("((value))", formElementValue);
        }

        //If the <arg> is for the ezdz file input box, get the path/name/ext
        if (window.ugui && window.ugui.filePath !== "") {
            argCommand = argCommand.replace("((path))", window.ugui.filePath);
            argCommand = argCommand.replace("((name))", window.ugui.fileName);
            argCommand = argCommand.replace("((ext))", window.ugui.fileExtension);
        }

        //get "((min)),((max))" from <arg name="range" custom="((min)),((max))">((min))-((max))</arg>
        var customValue = $(allArgElements[index]).attr("custom");

        //If there are no <arg>'s with custom values, skip this section
        if ( customValue ) {
            //Subtract the length of characters from the length of characters after all instances of "((" are removed, but not "(", then divide by 2 since each "((" represents one value.
            var findNumberOfValues = (customValue.length - customValue.replace(/\B(\(\()/g,"").length)/2;
            console.log(customValue);
            console.log("There are " + findNumberOfValues + " user defined custom values to parse.");
        }

        //if it has a value and is a checked checkbox or selected radio dial
        if ( formElementValue !== "" && $(formElementRadioCheckbox).prop("checked") ) {
            cmds.push(argCommand);
        //else if it has a value and isn't a checkbox or radio dial
        } else if ( formElementValue !== "" && formElementType !== "radio" && formElementType !== "checkbox" ) {
            cmds.push(argCommand);
        //no "else" statment, as we don't want to process unchecked radio/checkbox
        }

    }

    return cmds;
}

function putElementValuesInArgObj() {

    for (index = 0; index < executable.length; index++) {
        var cmdArgs = argsForm[index];
        //Cycle through all elements with a data-argName in #argsForm
        for (var subindex = 0; subindex < cmdArgs.length; subindex++) {
            //get "bob" from <input data-argName="bob" value="--kitten" />
            var argName = $(cmdArgs[subindex]).attr("data-argName");
            //get "--kitten" from <input data-argName="bob" value="--kitten" />
            var argValue = $(cmdArgs[subindex]).val();
            //get checkbox from <input data-argName="bob" type="checkbox" />
            var argType = $(cmdArgs[subindex]).attr("type");

            if (argType === "file") {
                setInputFilePathNameExt(cmdArgs[subindex], argName);
            } else if (argValue) {
                window.ugui.args[argName] = { "value": argValue };
            }
        }
    }

}

function setInputFilePathNameExt(currentElement, argName) {
    //Create a variable that contains all the file information supplied by webkit
    var fileAttributes = currentElement.files[0];

    //Before continuing, verify that the user has selected a file
    if (fileAttributes) {

        //Detect if in darwin, freebsd, linux, sunos or win32
        var platform = process.platform;

        //Create filename and filepath variables to be used below
        var filename = '';
        var filepath = '';

        // Either C:\users\bob\desktop\cows.new.png or /home/bob/desktop/cows.new.png
        var fullFilepath = fileAttributes.path;

        //cows.new.png
        filename = fileAttributes.name;

        //If you're on windows then folders in filepaths are separated with \, otherwise OS's use /
        if ( platform == "win32" ) {
            //Get the index of the final backslash so we can split the name from the path
            var lastBackslash = fullFilepath.lastIndexOf('\\');
            // C:\users\bob\desktop\
            filepath = fullFilepath.substring(0, lastBackslash+1);
        } else {
            //Get the index of the final backslash so we can split the name from the path
            var lastSlash = fullFilepath.lastIndexOf('/');
            // /home/bob/desktop/
            filepath = fullFilepath.substring(0, lastSlash+1);
        }

        //Split "cows.new.png" into ["cows", "new", "png"]
        var filenameSplit = filename.split('.');
        //Remove last item in array, ["cows", "new"]
        filenameSplit.pop();
        //Combine them back together as a string putting the . back in, "cows.new"
        var filenameNoExt = filenameSplit.join('.');

        //create the args object parameters on the ugui object
        window.ugui.args[argName] = {
            "fullpath": fileAttributes.path,
            "path": filepath,
            "name": filenameNoExt,
            "nameExt": filename,
            "ext": filename.split('.').pop(),
            "lastModified": fileAttributes.lastModified,
            "lastModifiedDate": fileAttributes.lastModifiedDate,
            "size": fileAttributes.size,
            "type": fileAttributes.type,
            "value": fileAttributes.path,
            "webkitRelativePath": fileAttributes.webkitRelativePath
        };
        console.log(ugui.args);
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
//                                                             //
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
//                                                             //
//                     UPDATE ABOUT MODAL                      //
//                                                             //
/////////////////////////////////////////////////////////////////
// This pulls in information about the application from the    //
// package.json file and puts in in the About modal. It also   //
// pulls in UGUI's about info from the _markdown folder.       //
/////////////////////////////////////////////////////////////////

function getAboutModal() {
    $.get("_markup/ugui-about.htm", function( aboutMarkup ){
        //Put UGUI about info in about modal
        $("#aboutModal .modal-body").append( aboutMarkup );

        //Wait for the "UGUI about" info to be loaded before updating the "App about" section
        //Load application name, version number, and author from package.json
        $(".applicationName").html(appName);
        $(".versionApp").html(appVersion).prepend("V");
        $(".authorName").html(authorName);
        $(".versionUGUI").html(uguiVersion);
        $("#aboutModal .nwjsVersion").append(" (Version " + process.versions['node-webkit'] + ")");
        $("#aboutModal .chromiumVersion").append(" (Version " + process.versions['chromium'] + ")");
        $("#aboutModal .iojsVersion").append(" (Version " + process.versions['node'] + ")");

        //After all content is loaded, detect all links that should open in the default browser
        openDefaultBrowser();

        //Remove modal, enable scrollbar
        function removeModal() {
            $("#aboutModal").slideUp("slow", function() {
                $("body").css("overflow","auto");
                //If the navigation is expanded, then close it after exiting the modal
                if ( !$(".navbar-toggle").hasClass("collapsed") ) {
                    $(".navbar-toggle").trigger('click');
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
//                                                             //
//                 NAVIGATION BAR FUNCTIONALITY                //
//                                                             //
/////////////////////////////////////////////////////////////////
// Everything in this section controls the visibility and the  //
// functionality of the items in the top nav bar.              //
/////////////////////////////////////////////////////////////////

//Clicking View > Command Line Output in the Nav Bar
$(".navbar a[href='#cmdoutput']").click( function() {
    $("#uguiDevTools nav span[data-nav='uguiCommand']").trigger("click");
});

//Clicking View > Console in the Nav Bar
$(".navbar a[href='#console']").click( function() {
    require('nw.gui').Window.get().showDevTools();
});

//Clicking View > Fullscreen
$(".navbar a[href='#fullscreen']").click( function() {
    require('nw.gui').Window.get().toggleFullscreen();
});

//Clicking "About" in the Nav Bar
$(".navbar a[href='#about']").click( function() {

    //Get the current Window
    var win = require('nw.gui').Window.get();

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
    win.on('resize', setModalHeight );

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
$(".navbar a[href='#exit']").click( function() {
    require('nw.gui').Window.get().close(true);
});







/////////////////////////////////////////////////////////////////
//                                                             //
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
} else if ( $("body").hasClass("dev") ){
    //Create UGUI Dev Tools markup
    $.get("_markup/ugui-devtools.htm", function( uguiDevToolsMarkup ) {
        //Put Dev Tool Markup on the page
        $("body.dev").append( uguiDevToolsMarkup );
        putExeHelpInDevTools();
        $("#uguiDevTools section").addClass("shrink");
        $("#uguiDevTools section *").addClass("shrink");
        $("#uguiDevTools").show();

        $("#commandLine").html("<span class='commandLineHint'>Click the <em>" + $(".sendCmdArgs").html() + "</em> button to see output.</span>");

        //Hide/Show based on UGUI Dev Tools navigation
        $("#uguiDevTools nav span").click( function() {
            var sectionClicked = $(this).attr("data-nav");
            $("#uguiDevTools nav span").removeClass("selected");

            if ( $("#uguiDevTools section." + sectionClicked).hasClass("shrink") ) {
                $("#uguiDevTools nav span[data-nav=" + sectionClicked + "]").addClass('selected');
                $("#uguiDevTools section").addClass("shrink");
                $("#uguiDevTools section *").addClass("shrink");
                $("#uguiDevTools section." + sectionClicked).removeClass("shrink");
                $("#uguiDevTools section." + sectionClicked + " *").removeClass("shrink");
            } else {
                $("#uguiDevTools nav span[data-nav=" + sectionClicked + "]").removeClass('selected');
                $("#uguiDevTools section." + sectionClicked).addClass("shrink");
                $("#uguiDevTools section." + sectionClicked + " *").addClass("shrink");
            }
        });

        swatchSwapper();
    });

    //get node webkit GUI - WIN
    var gui = require("nw.gui");
    // get the window object
    var win = require('nw.gui').Window.get();

    //Keyboard shortcuts
    keyBindings();

    //Check for duplicat Arg Names
    warnIfDuplicateArgNames();

}







/////////////////////////////////////////////////////////////////
//                                                             //
//               WARN IF IDENTICAL DATA-ARGNAMES               //
//                                                             //
/////////////////////////////////////////////////////////////////
// If the designer/developer uses the same data-argName value  //
// for multiple elements, display a warning.                   //
/////////////////////////////////////////////////////////////////

function warnIfDuplicateArgNames() {
    var duplicatesArray = {};
    var cmdArgs = [];

    for (index = 0; index < executable.length; index++) {
        cmdArgs = argsForm[index];
        for (var subindex = 0; subindex < cmdArgs.length; subindex++) {
            duplicatesArray[cmdArgs[subindex].dataset.argname] = cmdArgs[subindex];
        }
    }

    //Create a new array with duplicate argOrders removed
    cmdArgsWithoutDuplicates = [];
    for ( var key in duplicatesArray )
        cmdArgsWithoutDuplicates.push(duplicatesArray[key]);

    //If the new array had any duplicates removed display a warning.
    if ( cmdArgsWithoutDuplicates.length < cmdArgs.length ) {
        $.get("_markup/ugui-multiargnames.htm", function(multiArgNamesMarkup) {
            //Put alert mesage at top of page
            $("body.dev").prepend( multiArgNamesMarkup );
        });
        console.warn( "//////////////////////////////////////////////////////////////" );
        console.warn( "// You have more than one data-argName with the same value. //" );
        console.warn( "//////////////////////////////////////////////////////////////" );
    }
}







/////////////////////////////////////////////////////////////////
//                                                             //
//             PUT CLI HELP INFO IN UGUI DEV TOOLS             //
//                                                             //
/////////////////////////////////////////////////////////////////
// This funciton is only ran when in dev mode. It adds another //
// tab in the UGUI Developer Tools that returns information    //
// from the user's executable with arguments like --help.      //
/////////////////////////////////////////////////////////////////

function putExeHelpInDevTools() {
    //Add a new nav item in the Dev Tools based on the name of the user's Executable
    $("#uguiDevTools span[data-nav=uguiExecutable]").html(executable);
    $("#uguiDevTools .executableName").html(executable);

    //Declare a variable
    var executableHelpChoice;

    //Everytime the dropdown changes update the <pre>
    $("#uguiDevTools .helpDropdown").change( function() {

        //Update the variable to match the user's choice
        executableHelpChoice = $(this).val();

        //Run the executable using the user's chosen argument to get it's help info
        runcmd( executable + " " + executableHelpChoice, function(returnedHelpInfo) {
            //Put the help info in a <pre>
            $("#uguiDevTools pre.executableHelp").text( returnedHelpInfo );
        });

    });
}







/////////////////////////////////////////////////////////////////
//                                                             //
//                      SWAP BOOTSWATCHES                      //
//                                                             //
/////////////////////////////////////////////////////////////////
// This funciton is only ran when in dev mode. It grabs a list //
// of all files in the ven.bootswatch folder and puts them in  //
// a dropdown box in UGUI Developer Tools so developers can    //
// try out different stylesheets.                              //
/////////////////////////////////////////////////////////////////

function swatchSwapper() {
    //Allow access to the filesystem
    var fs = require("fs");
    //Grab all the files in the ven.bootswatch folder and put them in an array
    var allSwatches = fs.readdir("_style/ven.bootswatch", function(err, files) {
        //if that works
        if (!err)
            //check each file and put it in the dropdown box
            for (index = 0; index < files.length; index++) {
                var cssFileName = files[index];                     //cerulean.min.css
                var swatchName = files[index].split(".min.css")[0]; //cerulean
                $("#swatchSwapper").append("<option value='_style/ven.bootswatch/" + cssFileName + "'>" + swatchName + "</option>");
            }
        else
            console.warn("Could not return list of style swatches.");
    });

    //When you change what is selected in the dropdown box, swap out the current swatch for the new one.
    $("#swatchSwapper").change( function() {
        $("head link[data-swatch]").attr( "href", $("#swatchSwapper").val() );
        //Nav logo wasn't vertically centering after changing a stylesheet because the function was being ran after
        //the stylesheet was swapped instead of after the page rendered the styles. Unfortunately a delay had to be used.
        //71 was chosen because 14 FPS is the slowest you can go in animation before something looks choppy
        window.setTimeout(centerNavLogo, 71);
        window.setTimeout(sliderHandleColor, 71);
    });

}







/////////////////////////////////////////////////////////////////
//                                                             //
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
//                                                             //
//               LAUNCH LINKS IN DEFAULT BROWSER               //
//                                                             //
/////////////////////////////////////////////////////////////////
// Detects all links on the page with a class of external-link //
// and sets them to open the link in the user's default        //
// default browser instead of using NW.js as a browser.        //
/////////////////////////////////////////////////////////////////

function openDefaultBrowser() {

    // Load native UI library.
    var gui = require('nw.gui');

    // Open URL with default browser.
    $(".external-link").click( function( event ) {
        //prevent the link from loading in NW.js
        event.preventDefault();
        //get the href url for the current link
        var url = $(this).attr('href');
        //launch the user's default browser and load the URL for the link they clicked
        gui.Shell.openExternal( url );
    });
}
//Run once on page load
openDefaultBrowser();







/////////////////////////////////////////////////////////////////
//                                                             //
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

$('.ezdz').on('dragover', function() {
    $('.ezdz label').removeClass('text-info');    //Static
    $('.ezdz label').removeClass('text-success'); //Dropped
    $('.ezdz label').addClass('text-warning');    //Hover
});

$('.ezdz').on('dragleave', function() {
    $('.ezdz label').removeClass('text-success'); //Dropped
    $('.ezdz label').removeClass('text-warning'); //Hover
    $('.ezdz label').addClass('text-info');       //Static
});

function ezdz(fileInfo) {

    var file = fileInfo;

    $('.ezdz label').removeClass('text-info');    //Static
    $('.ezdz label').removeClass('text-warning'); //Hover

    if (this.accept && $.inArray(file.type, this.accept.split(/, ?/)) == -1) {
        return alert('File type not allowed.');
    }

    $('.ezdz label').addClass('text-success');   //Dropped
    $('.ezdz img').remove();

    if ((/^image\/(gif|png|jpeg|jpg|webp|bmp|ico)$/i).test(file.type)) {
        var reader = new FileReader(file);

        reader.readAsDataURL(file);

        reader.onload = function(event) {
            var data = event.target.result;
            var $img = $('<img />').attr('src', data).fadeIn();

            $('.ezdz img').attr('alt', "Thumbnail of dropped image.");
            $('.ezdz span').html($img);
        };
    }

    //Update the text on screen to display the name of the file that was dropped
    var droppedFilename = file.name + " selected";
    $('.ezdz label').html(droppedFilename);

}







/////////////////////////////////////////////////////////////////
//                                                             //
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
    //If the navbar is white set the slider handle to gray
    if (themeColor == "rgb(255, 255, 255)") {
        $(".slider .slider-handle").css("background-color", "#7E7E7E");
    } else {
        //Set the color of the slider handle to match the color of the nav bar
        $(".slider .slider-handle").css("background-color", themeColor);
    }
}

function sliderHandleGradient(themeGradient) {
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
//                                                             //
//                 CUT/COPY/PASTE CONTEXT MENU                 //
//                                                             //
/////////////////////////////////////////////////////////////////
// Right-click on any text or text field and you can now C&P!  //
//                                                             //
// Credit: https://github.com/b1rdex/nw-contextmenu            //
/////////////////////////////////////////////////////////////////

$(function() {
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
});







/////////////////////////////////////////////////////////////////
//                                                             //
//                       THE UGUI OBJECT                       //
//                                                             //
/////////////////////////////////////////////////////////////////
// We expose parts of UGUI to developers via the UGUI object.  //
// To quickly access what is available type 'ugui' into the    //
// NW.js Developer Tools console.                              //
/////////////////////////////////////////////////////////////////

window.ugui = {
    "allArgElements": allArgElements,
    "appDescription": appDescription,
    "appName": appName,
    "appTitle": appTitle,
    "appVersion": appVersion,
    "args": window.ugui.args,
    "authorName": authorName,
    "cmdArgs": "cmdArgs",
    "executable": executable,
    "packageJSON": packageJSON,
    "platform": process.platform,
    "textFields": textFields,
    "version": uguiVersion
};







}// end ugui();
