#UGUI Documentation:

There are 3 simple HTML attributes that UGUI uses to make creating a GUI for command line applications easier.

##data-argOrder

**IMPORTANT NOTE/TLDR:** All elements that will be processed by UGUI are required to have a `data-ArgOrder`. It tells UGUI what order they need to go in when being sent to the command line.

The argOrder is the order the arguments will go in when outputted to a command line. They can take any number value, though there should never be more than one element with the same argOrder value. The point is to tell UGUI what order they should go in, thus having two things go in the same spot can cause problems.

Example:

    <input type="checkbox" data-argOrder="13" value="-force"  />
    <input type="checkbox" data-argOrder="22" value="-concat" />
    <input type="checkbox" data-argOrder="4"  value="-minify" />

On output, if all 3 checkboxes were checked a command would be sent to the terminal/command prompt like so:

    executable -minify -force -concat

Sometimes arguments need to be in specific order, but it wouldn't logically make since to display the elements of a GUI in that same order. That is why `data-argOrder` is used.

Another example. Say you have an executable that processes an image and allows different arguments for how it will process it. It requires that they go in this order:

    executable [options] [filename]

You can have many different arguments in the options setting but you'll always want the filename to be at the end. It would make sense to have the browse box at the top of your GUI since the purpose of the application is to process images, having the user supply an image is important enough to have it at the top, even though the data value the user supplies will ultimately need to be at the end of the command line string sent out. So you simply make it's argOrder a large number to ensure it is always at the end.

    <input data-argOrder="999999" type="file />

If there are only 4 options on the page, setting the argOrder to 4 would still mean it's processed last. However, for best practices you should make it an unexpectedly large number to communicate to others that it needs to go last. This also prevents the GUI from breaking when you go to add other elements in the future when additional features are added to the command line version.

If you want to use a form element that interacts with the GUI and isn't related to the arguments being sent out to the command line, do not give it a `data-argOrder`. You could for example create a dropdown box that pre-fills out a form based on a template you created. This may alter the values of the form elements that have data-argOrders, but this dropdown itself doesn't exist to give argument options to the end user.

##data-argPrefix & data-argSuffix

###Suffix

Sometimes the data value itself isn't enough to fulfill the requirements of a command line argument. For example, the form element "range" produces a slider that the user can use to easily select a numeric value in a given range (1-10 for example). However the command line executable expects this value to be followed by `px` as it is a pixel value. In this instance you would use something like this:

    <input type="range" min="1" max="10" data-argOrder="16" data-argSuffix="px" />

Say the user moved the slider to the middle to select `5`, the argSuffix will add `px` to the end of it, the argument that is sent becomes `5px`.

###Prefix

This also works if you need to add something before the value instead of after. In this case you'd use `data-argPrefix`.

    <input type="range" min="1" max="100" data-argOrder="33" data-argPrefix="-accuracy " />

If the user picked 100 on the slider for level of accuracy they wanted, the output would combine the prefix and the value to produce `-accuracy 100`.

###Prefix and Suffix together

You can also use both a prefix and a suffix on one form element to wrap it's value in whatever text you've defined.

An example of this is if you need to put an argument name followed by a value in quotes. If there is an argument that allows the user to input a message it would look something like this:

    <textarea data-argOrder="40" data-argPrefix='-message "' data-argSuffix='"'></textarea>

When it is sent to the command line the prefix, value, and suffix get combined in to one string. If the user's messages was `Testing new feature.`, then it would be output as `-message "Testing new feature."`

Notice how the prefix contained ends with quotation mark and the suffix only contains a quotation mark.

Wrapping a value in quotes is up to you, but the prefix and suffix are a very easy way of doing so without having to touch any JavaScript yourself.

**BEST PRACTICES:** Many command line applications error out if there is an unexpected space, this can happen very easily in a filepath. It's a good idea to wrap any element that supplies a filepath in quotes in case the user points to a file that has a parent folder somewhere up the line with a space in it.

Without wrapping it in quotes you may send a command like this:

    <input data-argOrder="99" type="file" />
    executable c:\documents and settings\jdoe\desktop\file.txt

The executable will think the file supplied is `c:\documents` and then there are two more arguments after that `and` and `settings\jdoe\desktop\file.txt`. Instead add a prefix/suffix to wrap it in quotes.

    <input data-argOrder="99" type="file" data-argPrefix='"' data-argSuffix='"' />
    executable "c:\documents and settings\jdoe\desktop\file.txt"