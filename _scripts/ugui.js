$(document).ready( function(){







//var spawn = require('child_process').spawn,
//    ls    = spawn('node', ['--version']);

//ls.stdout.on('data', function (data) {
//  console.log( " " + data );
//});

//ls.stderr.on('data', function (data) {
//  console.log('stderr: ' + data);
//});

/////////////////////////////////////////////////////////////////
//                                                             //
//                           RUN CMD                           //
//                                                             //
/////////////////////////////////////////////////////////////////
// This is what makes running your CLI program and arguments   //
// easier.                                                     //
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







}); //end onReady