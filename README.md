#UGUI
====

##Universal Graphical User Interface

UGUI gives a face to command line programs, and that face is HTML/CSS/JS.

* * *

###The Problem

Currently software development requires you know a lot about a language to get to the point where you are able to make your application with a GUI. Once you get to that level you find that there are only a few options for good GUI libraries in whatever language you pick. Then you have to learn the ins and outs of that library to do anything decent with it. Soon you're wasting time on the GUI that could be put towards feature improvements and fixing bugs.

Worse, because you have to have such a large set of knowledge in programming to get to this point, there are few people with *great* design skills who are *also* capable of working in these environments. **We're cutting off our designers from being able to help**. At best you'll get a wireframe/mockup of what a designer *wants* the application to look like.

How do you spend your limited time now?

 * Working in GUI libraries for this **one** specific language?
 * Fixing bugs?
 * Do you take the time to implement new features knowing it will mean you'll have to redesign the GUI?
 * Give up and work on a different project, open source it and let someone else update it if they care...
 * Not even bother and just create a command line version, maybe a GUI will be made by *someone else* with the same or better experience with this specific language and it's GUI libraries.

I don't like these options, I see a lot of problems here.

**TLDR:**

1. Takes too much experience in one language and it's libraries to make GUIs.
2. GUI's are language specific and aren't easily portable to other languages of OS's.
3. Hard to compartmentalize the project to allow designers to actually help.
4. Developers spend time doing design work they're not good at while **not** doing the developing they **are** good at.

* * *

###The Solution!

What language does basically everyone, even most designers, know? HTML/CSS!

Front end web design has come a long way and is the only real *Universal* GUI language that exists. Anyone can learn it, and there are at TON of resources and libraries for it.

So how does this solve the problems from above?

1. You know longer need to be an expert in the language the program was written in! This means the number of people able to work on the GUI is much larger.
2. Since the GUI is created separate from the application itself, it allows us to reuse the GUI on any platform. If you have multiple versions of the same CLI program written in different languages for Windows, Mac, and Linux, you could use **THE SAME** UGUI file for all 3.
3. With the Interface no longer being tied to the developer it allows designers and front end developers to come in and help without developers having to babysit their efforts.
4. This means developers can focus on adding features and fixing bugs and let the designers worry about the GUI.

* * *

###How does UGUI work/Getting Started!

UGUI gives you a ton of control. There are a lot of options to make the process as easy and learning curve as simple as possible. For example you can use any libraries you're already comfortable with (jQuery/Twitter Bootstrap).

To make this as easy as possible I've created a list of how to use and get started with UGUI. Once you've created a basic project **everything else is optional**.

1. Download [Node-Webkit](https://github.com/rogerwang/node-webkit).
2. Download a UGUI template file (Soon to be posted, many to come).
3. Add the switches from your command line application to the index.html file and apply appropriate UI elements for them (checkboxes, dropdowns, etc.).
4. Test your project in Node-Webkit.
5. Zip up your project and rename it from `.zip` to `.nw`. Tell those who download your app to open it in node-webkit. (You're done, everything beyond this point is optional)
6. Follow [this tutorial](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps) to create a stand alone version that will open your desired platform.
7. If you have CLI versions for Lin/Win/Mac and they use the same switches, put them all in the root and package them like in step 5. One .nw file will work on all three (theoretically, still need to test)
8. Produce .nw and stand alone versions for each OS.
9. Optimize all images and minifiy/concat your code before packaging to .nw and standalone version.

Tutorial video coming soon once we get all the steps in this process complete.

* * *

###What is UGUI based on?

UGUI is based on Intel's Node-Webkit, which itself is based on Node.JS and Webkit (how about that!).

Webkit is the popular engine that is used in Chrome/Chromium, Safari, Opera, and most Android and iOS browsers. It's been a leader in supporting most new HTML5/CSS3 features (CSS Animation, Video/Audio, WebGL, etc).

Node.JS gives I/O support for JavaScript Developers. This is the key for us as it lets you read/write/edit/create files from with in the browser.

* * *

###To-Do List

* Test packaging in different OS environments
* Create ugui.js that will help abstract out connecting switches through the html/JS, to make the process as simple as possible for front end designers.
* Create several templates based on Twitter Bootstrap for different types of applications to give people quick places to start from.
* Create UGUI logo (I'm thinking something with a [cartoon frog](http://imgur.com/IitQXw4), but I guess it could be anything).
* Create UGUI site that organizes templates and tutorials and lays everything out in a quick and easily digestible manner. Also highlights programs using UGUI.
* Ultimately I'd like to make a program that makes this whole process far less manual. UGUI Designer would have the following features:
 1. Detect all JS and CSS files, uglify, minify, concat them in to one JS and one CSS doc.
 2. Remove any files not being used in the production version (git files, sass, etc.)
 3. Ability to export project to different environments (Win 32/64, Ubuntu, OSX, etc.)
 4. Quick testing in Node-Webkit and portable Chromium that matches the same version as Node-Webkit.