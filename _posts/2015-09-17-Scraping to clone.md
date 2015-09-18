---
layout: post
title: Python - Scrape a list of git repos
summary: Scrape a list of git repos with python, multiple threads.
tags: ["howto", "code", "programming", "python"]
---

I wanted to be able to scrape a list of git repos off of a webpage linking example usages of a particular product, and thought I'd share with the world one possible solution to the problem.

The basic idea is to:

1. Query the src html file
2. Scrape links from the src file
3. Try to clone each link

More complexities exist though.
First, we want to minimize the number of calls externally to one per git repo, and one for the html file.
Therefore, we change the algorithm to this:

1. Load list of links
    - If `./fileList.txt` exists
        - Query the src html file and store all links in list of links
    - Else
        - Query src html, and scrape links, saving to `fileList.txt` for future calls to the scraper (e.g. we halted the program because it was taking too long.)

2. Try to clone each link
    - Open a new thread to execute the git clone command in.
    - Setup a callback function, so when the thread exits, we remove the
    finished (successfully or unsuccessully) link from the links list.

3. Save modified list of links to ./fileList.txt

```python

#!/usr/bin/env python

import urllib
import re
import threading
import subprocess

#The url to scrape
src = "https://github.com/jekyll/jekyll/wiki/Sites"

def popenAndCall(onExit, onExitArgs, popenArgs):
    def runInThread(onExit, popenArgs):
        proc = subprocess.Popen(popenArgs)
        proc.wait()
        onExit(onExitArgs)
        return
    thread = threading.Thread(target=runInThread, args=(onExit, popenArgs))
    thread.start()
    # returns immediately after the thread starts
    return thread


links = [] #define here so we have scope for the rest of the file.
           # we could even replace the Popen callback function above
           # to remove the finished process from the links array inline

try: #and we try to open the file and read it
    with open('listOfRepos','r') as file:
        for line in file:
            links.append(line)
except:  #We have to requery
    #Just a piece of regex to match any urls
    urlCheck = "(http|ftp|https)://([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?"

    #for each line containing "href", extract all valid urls.
    for line in [line for line in urllib.urlopen(src).readlines() if "href" in line]:
        for link in re.finditer(urlCheck, line):
            links.append(line[link.start():link.end()])

    #and limit these lines to those containing github.com
    links = [link for link in links if "github.com" in link]

# this is just a callback function that will be executed when processes are closed
def finished(name):
    if name in links:
        print("removed " + name)
        links.remove(name) #Now we wont save it when we are finished

threads =[] #for scope
try:
    threads = [popenAndCall(finished, links[i], ["git", "clone", links[i], " ./repos/repo_" + str(i)])
                for i in range(0, len(links)) if links[i]]
except:
    print("ERROR while forking process")

for thread in threads: thread.wait()

with open('listOfRepos','w') as file:
    for link in links:
        if link.strip() is not "":
            file.write(link.strip() +"\n")


```
