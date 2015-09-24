#![UGUI Logo](http://i.imgur.com/2jHRUvA.png "Universal Graphical User Interface")

##Universal Graphical User Interface

**UGUI gives a face to command line programs, and that face is HTML, CSS, & JS.**

Create your own cross-platform desktop applications in minutes using UGUI.

* * *

###Download

Download UGUI to use it for your project:

* Version 1.0 (Coming soon) | Tutorial for Version 1.0 (Coming Soon)

* * *

###What is UGUI

UGUI is a library and framework for NW.js (formally Node-Webkit) that is designed to make creating a desktop application as easy as possible. We specifically target the creation of GUI applications for command line programs, however UGUI can also be used as a general purpose starting point for any type of desktop application.

Our goal is to allow anyone, even those with no prior coding knowledge, to create a desktop application in just 5 minutes.

* * *

###Project Roadmap

**Current Version:** V0.9
**Status:** You know when you have to break something first before you can fix it? Wellll, that parts accomplished!

**Phase 1: The library and framwork.**

* V1.0 ~~Create ugui.js that will help abstract out connecting switches through the HTML/JS, to make the process as simple as possible for front end designers.~~
* V1.0 ~~Create UGUI logo.~~
* V1.0 ~~Remove all browser specific stuff that isn't relevant like -moz, -o, -ms, filter, old -webkit, EOT, etc.~~
* V1.0 ~~Clean up template to have generic sample content.~~
* V1.0 ~~Create About/Help modal using dynamic information. Separate user about from UGUI about markup.~~
* V1.0 ~~Update layout design using Bootstrap.~~
* V1.0 ~~Have the "About" link in the navbar added via ugui.js~~
* V1.0 ~~Update [GitHub project](http://github.com/UniversalGUI) to separate repos for UGUI Framework, Templates, Website, CLI, and UGUI Designer.~~
* V1.0 ~~Clean up UGUI About section to have github credits icons appear dynamically or work offline.~~
* V1.0 ~~Add in basic form validation to prevent the user from breaking the command line with bad characters~~
* V1.0 ~~Add a button to the UGUI Dev tools that allows the developer to set their stylesheet without having to edit the index.htm file~~
* V1.0 ~~Bug found: Redo the UGUI engine to be easier and simpler and have better functionality.~~
* V1.0 ~~Implement Dan's definition pattern matching engine~~
* V1.0 ~~UGUI Devtools needs to have an exectuable selector~~
* V1.0 ~~Save/Load Settings~~
* V1.0 Test realworld usage of UGUI and prod mode
* V1.0 Test in OSX, Linux, and Windows (again)
* V1.1 Multi-File import
* V1.1 Create NPM compliant package.json alternative
* V1.5 Add some type of JSHint-like library to UGUI Dev Tools to inform developers about syntax errors.
* V1.5 Test packaging in different OS environments.
* V1.5 NW.js plans to implement a native spellchecker in version 13, if that doesn't occur, implement one into UGUI.

**Phase 2: Site: Templates, Tutorials, & Documentation**

The repo for the Phase 2 website is here: [github.com/UniversalGUI/UniversalGUI.github.io](https://github.com/UniversalGUI/UniversalGUI.github.io/tree/dev)

* ~~Buy domain name: [UGUI.io](http://ugui.io)~~
* ~~Create a [community forum](http://ugui.reddit.com) for discussions~~
* Create UGUI site:
 * ~~[Temp Splash Page](http://ugui.io)~~
 * Design: In progress
 * Homepage: In progress
 * Documentation Page: In progress
  * Annotated Source Code: In progress
 * Tutorials Page: Not started
 * Showcase of applications made with UGUI: Not started
 * Templates Page: Not started
* Create Explainer and tutorial videos.
 * UGUI Explainer: In Preproduction, Script and Storyboard complete. Artwork needs made and animated. Naration needs recorded.
 * Tutorial: Comprehensive and 30 second video covering running your project for development and distribution
 * Tutorial: Getting Started with UGUI (embedded in V.1 of UGUI)
 * Tutorial: Covering every file in the UGUI project in detail.
 * Explainer: What is NW.js? In preproduction. Some artwork created, script done.
 * Demo: Creating a desktop application using UGUI.
 * Tutorial: Advanced way
* Create several templates based on Twitter Bootstrap for different types of applications to give people quick places to start from.
 * Hardware Pack template to be created using D3.JS library to graphically display information about hardware such as CPU and RAM usage.
 * File System Pack template to be created to display information about files in a folder, file sizes, etc.
 * 3D Pack template using OpenGL and three.js to take advantage of 3D.
 * System Tray template for windowless application using native system tray and context-menu.
 * Mega Pack which combines most of the parts from all other official template packs.
 * More general templates that just focus on different visual layouts.
 * Advanced templates for more unique CMD programs.
* Advertise the existence of this project like crazy!

**Phase 3: UGUI Designer: The wizard and automation studio**

* Ultimately I'd like to make a program that makes this whole process far less manual. The program, *UGUI Designer*, would have the following features:
 1. Detect all JS and CSS files, uglify, minify, concat them in to one JS and one CSS doc.
 2. Remove any files not being used in the production version (git files, sass, etc.)
 3. Ability to export project to different environments (Win 32/64, Ubuntu, OSX, etc.)
 4. Eventually the exporting function would create an installer for Windows that will check if the required version of NW.js is already installed and if not download and install it, allowing for much smaller file sizes when packaging and distributing.

* * *

###Known Issues

* Loading settings doesn't update the value of `<input type="file">`. It does update it's internal file list though and should be functional if ran. There seems to currently be no method of updating the value of these elements due to security restrictions originally placed in Chromium. To get around this, we visually update the EZDZ plugin to make it look as though it's been updated, this however will not make a required `<input type="file">` activate as being fullfilled until the user interacts with it. To work around this you can give the EZDZ input a class of `do-not-save` or remove the `required="required"`.
* Range slider value is empty in the UGUI Arg Obj (window.ugui.args) on load. This doesn't matter though as it will get it's value when clicking run or any other form element with a data-argName, which in turn updates the UGUI Developer Toolbar's CMD Output Preview. Will not fix. Will accept pull request.

* * *

###Credits

* [The Jared Wilcurt](http://github.com/TheJaredWilcurt) - Creator/Maintainer
* [Dan O'Dea](http://github.com/DanOdea) - Definition Pattern Matching Engine Architect - Save/Load Settings features
* [Hai Nguyen](http://github.com/hai5nguy) - UGUI Project Architechture Consultant
* [Stephan Raab](http://github.com/StephanRaab) - UGUI Website Designer
* [Grahammer](http://github.com/GWatt) - UGUI Engine Architechture Consultant
* [Boyma Fahnbulleh](http://github.com/boymanjor) - Beta, Realword, and OSX testing
* [NW.JS](http://nwjs.io) - The foundation of UGUI! Special thanks to Roger Wang.
 * [IO.JS](http://iojs.org)
 * [Chromium](http://www.chromium.org)
 * [V8](https://code.google.com/p/v8)
* [jQuery](http://jquery.com)
* [Twitter Bootstrap](http://getbootstrap.com)
* [Bootswatch](http://bootswatch.com)
* [ezdz](https://github.com/jaysalvat/ezdz)
* [Bootstrap Slider](http://seiyria.github.io/bootstrap-slider)
* [Bootstrap Dropdowns Enhancement](http://behigh.github.io/bootstrap_dropdowns_enhancement)
* [Cut, Copy, Paste Context Menu](https://github.com/b1rdex/nw-contextmenu)
* [Sass](http://sass-lang.com) - Just cuz it's awesome
