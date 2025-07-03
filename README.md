This is the source code for my private google extension, if you want to try this yourself clone this github repo then enable developer mode at chrome://extensions and load unpacked, then load the folder this repo is cloned in </br>
after its loaded open a terminal, then navigate to where you store this extension and run python server.py so files can transfer data between each other
</br>
</br>
some things that this can do: </br>
when you load a page it searches for suspicious keywords in the source code of the url, doesnt guarantee that you find any sensitive data but points it out with a window alert </br>
looks at the url for an open redirect using a scikit model at the same time it searches the source code </br>
</br>
</br>
At the second the input mapping is pretty slow and buggy so it may only work on sites with under 2 or 1 megabytes of html in the document</br>
if you have any ideas of how to fix this in my code then make a pull request and ill review your changes </br> </br></br>
context menus: </br> 
when you right click anywhere that isnt an element, hover over 'hacking helper' </br>
currently there are five context menus, one of them evaluates the current url and spots stuff like idor or any possible data insertion </br>
second one lets you run reflected XSS payloads, these payloads are just for you to see if the page has the vulnerability and doesnt run anything malicious, but make sure you have permission to test these kinds of attacks </br>
the third one lets you create a custom request with the method of your choice (GET,POST,Put,etc), your chosen request headers, and if the method allows, your own request body </br>
thr fourth one lets you map out all the inputs that the ai model detects in the document html, it also guides the page to the input so you can search for bug bounties in the inputs, at the second the ai model isnt very smart, so if you really want to make use of this feature update the README to remind me to train the modek </br>
the fifth and last one lets you view the cookies for your current url and will show red by the cookie if my other ai model (hopefully smarter) detects that the cookies may allow authentication bypass
</br>
</br>
please dont use this tool for anything illegal and if you have any ideas to improve this or spot if you spot any problems make a pull request to update the future fixes list
</br></br>
Future fixes: </br>
train input mapping ai to be smarter </br>
make input mapping less buggy </br>
add features to help with more aspects of hacking
</br> </br>
