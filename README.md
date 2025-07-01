This is the source code for my private google extension, if you want to try this yourself clone this github repo then enable developer mode at chrome://extensions and load unpacked, then load the folder this repo is cloned in </br>
after its loaded open a terminal, then navigate to where you store this extension and run python server.py so files can transfer data between each other
</br>
</br>
some things that this can do: </br>
when you load a page it searches for suspicious keywords in the source code of the url, doesnt guarantee that you find any sensitive data but points it out with a window alert </br>
looks at the url for an open redirect using a scikit model at the same time it searches the source code </br>
</br>
context menus: </br>
when you right click anywhere that isnt a page hover over 'hacking helper' </br>
currently there are only two context menus, but one of them evaluates url and spots stuff like idor or any possible data insertion </br>
the other one lets you run reflected XSS payloads, these payloads are just for you to see if the page has the vulnerability and doesnt run anything malicious, but make sure you have permission to test these kinds of attacks </br>
</br>
Future fixes: </br>
none so far...
</br>
please dont use this tool for anything illegal and if you have any ideas to improve this or spot if you spot any problems make a pull request to update the future fixes list
