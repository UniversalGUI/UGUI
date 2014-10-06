$(document).ready( function(){







/////////////////////////////////////////////////////////////////
//                                                             //
//                           RUN CMD                           //
//                                                             //
/////////////////////////////////////////////////////////////////
// This is what makes running your CLI program and arguments   //
// easier. Cow & Taco examples below to make life easier.      //
//                                                             //
// $("#taco").click(function(){                                //
//   runcmd("pngquant", ["--force", "file.png"]);              //
// });                                                         //
//                                                             //
// runcmd("node", ["--version"], function(data){               //
//   $("#cow").html("<pre>Node Version: " + data + "</pre>");  //
// });                                                         //
//                                                             //
/////////////////////////////////////////////////////////////////

function runcmd( executable, args, callback ) {
  var spawn = require('child_process').spawn;
  var child = spawn( executable, args );

  child.stdout.on('data', function(chunk) {
    if (typeof callback === 'function'){
      callback(chunk);
    }
  });

  //child.stderr.on('data', function (data) {
  //  console.log('stderr: ' + data);
  //});

};







/////////////////////////////////////////////////////////////////
//                                                             //
//                   RANGE SLIDER INCREMENTS                   //
//                                                             //
/////////////////////////////////////////////////////////////////
// This will automatically add incremental lines/ticks above   //
// range sliders in your forms. Copy/Edit the HTML below and   //
// the JS will take care of the rest.                          //
//                                                             //
// <label for="amp">How loud is your amp?</label>              //
// <input type="range" min="1" max="11" value="5" id="amp"     //
// step="1" list="amplist">                                    //
//                                                             //
/////////////////////////////////////////////////////////////////

//http://demosthenes.info/blog/757/Playing-With-The-HTML5-range-Slider-Input
//http://demosthenes.info/blog/864/Auto-Generate-Marks-on-HTML5-Range-Sliders-with-JavaScript

function ticks(element) {
    if (element.hasOwnProperty('list')
     && element.hasOwnProperty('min')
     && element.hasOwnProperty('max')
     && element.hasOwnProperty('step')) {
        var datalist = document.createElement('datalist'),
             minimum = parseInt(element.getAttribute('min')),
                step = parseInt(element.getAttribute('step')),
             maximum = parseInt(element.getAttribute('max'));
         datalist.id = element.getAttribute('list');
        for (var i = minimum; i < maximum + step; i = i + step) {
            datalist.innerHTML += "<option value=" + i + "></option>";
        }
        element.parentNode.insertBefore(datalist, element.nextSibling);
    }
}
var lists = document.querySelectorAll("input[type=range][list]"),
      arr = Array.prototype.slice.call(lists);
arr.forEach(ticks);







/////////////////////////////////////////////////////////////////
//                                                             //
//                 CUT/COPY/PASTE CONTEXT MENU                 //
//                                                             //
/////////////////////////////////////////////////////////////////
// Right-click on any text or text field and you can now C&P!  //
//                                                             //
// Credit: https://github.com/b1rdex/nw-contextmenu            //
//                                                             //
/////////////////////////////////////////////////////////////////

$(function() {
  function Menu(cutLabel, copyLabel, pasteLabel) {
    var gui = require('nw.gui')
      , menu = new gui.Menu()

      , cut = new gui.MenuItem({
        label: cutLabel || "Cut"
        , click: function() {
          document.execCommand("cut");
          console.log('Menu:', 'cutted to clipboard');
        }
      })

      , copy = new gui.MenuItem({
        label: copyLabel || "Copy"
        , click: function() {
          document.execCommand("copy");
          console.log('Menu:', 'copied to clipboard');
        }
      })

      , paste = new gui.MenuItem({
        label: pasteLabel || "Paste"
        , click: function() {
          document.execCommand("paste");
          console.log('Menu:', 'pasted to textarea');
        }
      })
    ;

    menu.append(cut);
    menu.append(copy);
    menu.append(paste);

    return menu;
  }

  var menu = new Menu(/* pass cut, copy, paste labels if you need i18n*/);
  $(document).on("contextmenu", function(e) {
    e.preventDefault();
    menu.popup(e.originalEvent.x, e.originalEvent.y);
  });
});







}); //end onReady