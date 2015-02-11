#![UGUI Logo](_assets/logo/ugui-logo.png "Universal Graphical User Interface")

##Universal Graphical User Interface: FAQ

* * *

###Getting Started!

To make this as easy as possible I've created a list of how to use and get started with UGUI. Once you've created a basic project **everything else is optional**.

1. Download [nw.js](http://nwjs.io).
2. Download a UGUI template file (Soon to be posted, many to come).
3. Add the switches from your command line application to the index.html file and apply appropriate UI elements for them (checkboxes, dropdowns, etc.).
4. Test your project in nw.js.
5. Zip up your project and rename it from `.zip` to `.nw`. Tell those who download your app to open it in nw.js. **(You're done, everything beyond this point is optional)**.
6. Follow [this tutorial](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps) to create a standalone version that will open on your desired platform without the user having to install nw.js.
7. If you have CLI versions for Lin/Win/Mac and they use the same switches, put them all in the root and package them like in step 5. One .nw file will work on all three (theoretically, still need to test)
8. Produce .nw and stand alone versions for each OS.
9. Optimize all images and minify/concat your code before packaging to .nw and standalone version.

Tutorial video coming soon once we get all the steps in this process ironed out.

* * *

###The Problem

Currently software development requires you know a lot about a language to get to the point where you are able to make your application with a GUI. Once you get to that level you find that there are only a few options for good GUI libraries in whatever language you pick. Then you have to learn the ins and outs of that library to do anything decent with it. Soon you're wasting time on the GUI that could be put towards new features, improvements, and bug fixes.

Worse, because you need such a large set of knowledge in programming to get to this point, there are few people with *great* design skills who are *also* capable of working in these environments. **We're cutting off our designers from being able to help**. At best you'll get a wireframe/mockup of what a designer *wants* the application to look like.

How do you spend your limited time now?

 * Working in GUI libraries for this **one** specific language?
 * Fixing bugs?
 * Do you take the time to implement new features knowing it will mean you'll have to redesign the GUI?
 * Give up and work on a different project, but ya know, open source it and let someone else update it if they care...
 * Not even bother and just create a command line version, maybe a GUI will be made by *someone else* with the same or better experience with this specific language and its GUI libraries.

I don't like these options, I see a lot of problems here.

**TLDR:**

1. Takes too much experience in one language and it's libraries to make GUIs.
2. GUI's are language specific and aren't easily portable to other languages or OS's.
3. Hard to compartmentalize the project to allow designers to actually help.
4. Developers spend time doing design work they're not good at while **not** doing the developing they **are** good at.

* * *

###The Solution!

What language does basically everyone, even most designers, know? HTML/CSS!

Front end web design has come a long way and is the only real *Universal* GUI language that exists. Anyone can learn it, and there are at TON of resources and libraries for it.

So how does this solve the problems from above?

1. You no longer need to be an expert in the language the program was written in! This means the number of people able to work on the GUI is much larger.
2. Since the GUI is created separate from the application itself, it allows us to reuse the GUI on any platform. If you have multiple versions of the same CLI program written in different languages for Windows, Mac, and Linux, you could use **THE SAME** UGUI file for all 3.
3. With the interface no longer being tied to the developer it allows designers and front end developers to come in and help without developers having to babysit their efforts.
4. This means developers can focus on adding features and fixing bugs and let the designers worry about the GUI.

* * *

###How does UGUI differ from just using nw.js

UGUI is a framework FOR nw.js. So at it's core, it really doesn't differ. In both instances you're making a nwjs app. The point of the UGUI project is to make the process as easy and simple as possible. We want to create dynamic templates that can be used in most instances and take most of the hassle out of the process so designers can focus on designing, and not coding. This is why our templates are based around jQuery and Twitter Bootstrap. These are familiar and easy to work with for most front-end developers/designers. We want to give you all the resources you need already set up out of the box to save you time.
