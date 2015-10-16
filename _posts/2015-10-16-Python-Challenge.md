
# Python Challenge
    This is my python challenge notebook

First lets make a list of the urls to each level, starting with no url, that we will try to fill in this document.

Also lets define a function that will display a given levels page


```python
from IPython.display import display

levels=["" for i in range(30)]
from IPython.display import IFrame

def displayLevel(idx):
    IFrame(levels[idx], width=1000, height=600)

base="http://www.pythonchallenge.com/pc/def/"
levels[0]=base+"0.html"
display(levels[0])
```
[Level 0](http://www.pythonchallenge.com/pc/def/0.html)

# Level 0
OK so challenge 1 has a picture of 2^38 and a hint to go to the URL


```python
levels[1]=base+str(2**38)+".html"
display(levels[1])
```

[Level 1](http://www.pythonchallenge.com/pc/def/274877906944.html)


# Level 1
Now were at a page at .../def/map.html
- K=>M
- O=>Q
- E=>G

And a message at the bottom:

"everybody thinks twice before solving this.

g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. bmgle gr gl zw fylb gq glcddgagclr ylb rfyr'q ufw rfgq rcvr gq qm jmle. sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj."

Thats interesting. I think its a simple shift cypher


```python
message="everybody thinks twice before solving this. g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. bmgle gr gl zw fylb gq glcddgagclr ylb rfyr'q ufw rfgq rcvr gq qm jmle. sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj."

map={}
map["K"] = "M"
map["O"] = "Q"
map["E"] = "G"

#Whats the difference between each letter value in our map from its key index
for key in map:
    display("The difference between %s and %s is %s"
          %  (key, map[key], ord(key)-ord(map[key])))
```

    'The difference between K and M is -2'
    'The difference between E and G is -2'
    'The difference between O and Q is -2'

See that consistent distance. Trademark of a shift cypher!
OK so now we apply a 2 shift to our message:


```python
shiftedMessage = ''.join([chr(ord(char)+2) for char in message])
display(shiftedMessage)
```


    'gxgt{dqf{"vjkpmu"vykeg"dghqtg"uqnxkpi"vjku0"i"hope"you"didnt"tr{nsl{te"it"|y"h{nd0"th{ts"wh{t"computers"{re"for0"doing"it"in"|y"h{nd"is"inefficient"{nd"th{t)s"why"this"text"is"so"long0"using"string0m{ketr{ns*+"is"recommended0"now"{pply"on"the"url0'


And look at that utter gibberish, but with some words at the end. Lets think about why. First, the words at the beginning track back to "everybody thinks..." proper english. I only included in case it was a part of the cypher too or something. Additionally, we see that punctuation and spaces should have been ignored. Lets retry that.


```python
message="g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. bmgle gr gl zw fylb gq glcddgagclr ylb rfyr'q ufw rfgq rcvr gq qm jmle. sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj."
disallowed=" "

def shiftChar(c, dist):
    if c in disallowed:
        return c
    else:
        return chr(ord(c)+dist)

shiftedMessage = ''.join([shiftChar(c,2) for c in message])
display(shiftedMessage)
```


    'i hope you didnt tr{nsl{te it |y h{nd0 th{ts wh{t computers {re for0 doing it in |y h{nd is inefficient {nd th{t)s why this text is so long0 using string0m{ketr{ns*+ is recommended0 now {pply on the url0'


OK I can read it now, whatever.

So apparently we apply that shift to the url, which is currently map


```python
ans = "".join([shiftChar(c, 2) for c in "map"])
display(ans)
```

    'ocr'

Great so the solution is: http://www.pythonchallenge.com/pc/def/ocr.html


```python
levels[2]=base+ans+".html"
display(levels[2])
```
[Level 2](http://www.pythonchallenge.com/pc/def/ocr.html)

# Level 2
TODO 2 and 3 got mixed up??
Hmm a picture of a book and it tells us "recognize the characters. maybe they are in the book,
but MAYBE they are in the page source."

# Looking at the pagesource there is something strange:

```
    <font size="-1" color="gold">
    General tips:
    <li>Use the hints. They are helpful, most of the times.</li>
    <li>Investigate the data given to you.</li>
    <li>Avoid looking for spoilers.</li>
    <br>
    Forums: <a href="http://www.pythonchallenge.com/forums">Python Challenge Forums</a>,
    read before you post.
    <br>
    IRC: irc.freenode.net #pythonchallenge
    <br><br>
    To see the solutions to the previous level, replace pc with pcc, i.e. go
    to: http://www.pythonchallenge.com/pcc/def/ocr.html




    <!--
    find rare characters in the mess below:
    -->

    <!--
    HUGE STRING COPIED IN CODE BELOW:
    -->

    </font>
```

So clearly we need to go through this crazy string and count the occurences. Python countable to the rescue


```python
crazyText="%%$@_$^__#)^)&!_+]!*@&^}@[@%]()%+$&[(_@%+%$*^@$^!+]!&_#)_*}{}}!}_]$[%}@[{_@#_^{*@##&{#&{&)*%(]{([*}@[@&]+!!*{)!}    { +{))])[!^})+)$]#{*+^((@^@}$[**$&^{$!@#$%)!@(&+^!    { _$&@^!}$_${)$_#)!({@!)(^}!*^&!$%_&&}&_#&@{)]{+)%*{&*%*&@%$+]!*__(#!*)    { &@++!_)^$&&%#+)}!@!)&^}**#!_$([$!$}#*^}$+&#[{*{}{((#$]{[$[$$()_#}!@}^@_&%^*!){*^^_$^]@}#%[%!^[^_})+@&}{@*!(@$%$^)}[_!}(*}#}#___}!](@_{(*#%!%%+*)^+#%}$+_]#}%!**#!^_)@)$%%^{_%!@(&{!}$_$[)*!^&{}*#{!)@})!*{^&[&$#uVJANZKKoufiHYjLtdmUlryQdFikZbDjgqfnzLRwVArFgglSdAljflUTjSyOxJfcuyqKeLkXLVZgsAgnjpJgdNhenJeNJhIdKMRFGISYuLjpdYPueEfOySxZsKoiAaxnTWGvVyHaLBaQTlAyWTaVOjENThhHZIldJysycKTLZNgOfIWHaeKHzUkuOKIMwZZfWRcmgIMqdHKDdmwBWFjcOOpPiTWQdYzXGyotjpzRQVJtUiNimtRmV       ...       ...       ...       ...       ...       WlQwmPdhGavFfwtAZZyBqAxYBpRNLmpOGpTyfrLlNbtBmZofqsFjpyxlafFhCUSlkHSiWgJQqGikwsJMMzLaiCEJQZXzzdfkmNgpkXFXyUYUKOlrPNRhnHKvolzGXFmuJQjqUYCgqLQYsHJsodFfHGARGcQuboCWQOmtiwFupndJNUFQIDSbetUKylhSUjcDVtbiQrWMRQhAwGUZyPneCGUjGBBTkLqxLAXXtBKfErkDaWMFZZeuqDmXKJEGHyToPUhPphfVhgUZgbIuRAtWnroImpJKqqmEZqeNQCKzhjIkKQHURWLXFwPBuijeoTSpsVLaOGuLVjMZXkBvVXwUuHfBihziiavGSYofPNeKsTXruMUumRRPQJzvSzJkKbtSipiqBd" #truncated
pattern="[A-Z][A-Z][A-Z][a-z][A-Z][A-Z][A-Z]"
import re
display(re.findall(pattern,text))
```

Well that took forever, and yielded nothing...
I screwed up it says "exactly", lets change the pattern


```python
pattern="[a-z][A-Z][A-Z][A-Z][a-z][A-Z][A-Z][A-Z][a-z]"
display("hello")
ans=re.findall(pattern,text)
display(ans)
```


```python
#pretty
name = ''.join([i[4] for i in ans])
levels[4]=base+"linkedlist"+".html"
display(levels[4])
```

[Level 4](http://www.pythonchallenge.com/pc/def/linkedlist.html)

Sweet, that one was fun.
# Level 4

OK, navigating to the page yields:
linkedlist.php

Which if you navigate has a picture of a wooden toy lumbermill thingy.
If you click it it goes to a page at:
  http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=12345

Which says:
- `and the next nothing is 44827`





It says
 - `urllib may help. DON'T TRY ALL NOTHINGS, since it will never end. 400 times is more than enough.`

 Clearly this is saying that if you go to 44827 in the above link then you'll get another number. Lets recursively follow that 400 times and see what happens

 Cool, I don't know the urllib yet, so this'll be great. Quick google leads me to
 https://docs.python.org/2/library/urllib.html

 I see an example that looks good
```
import urllib
params = urllib.urlencode({'spam': 1, 'eggs': 2, 'bacon': 0})
f = urllib.urlopen("http://www.musi-cal.com/cgi-bin/query?%s" % params)
print f.read()
```

 Lets shamelessly use this

 Also lets notice that



```python
levels[4] = levels[4][:-5] + ".php" #change html to php
display(levels[4])
import urllib
f = urllib.urlopen(levels[4])
display(f.read())
```

http://www.pythonchallenge.com/pc/def/linkedlist.php

    ---------------------------------------------------------------------------

    AttributeError                            Traceback (most recent call last)

    <ipython-input-16-e06c7f2a70d5> in <module>()
          2 display(levels[4])
          3 import urllib
    ----> 4 f = urllib.urlopen(levels[4])
          5 display(f.read())


    AttributeError: 'module' object has no attribute 'urlopen'


OK back to reading. Guess I should use urllib.request


```python
import urllib.request
display(levels[4])
f = urllib.request.urlopen(levels[4]+"?nothing=12345")
display(f.read())
```
    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    <ipython-input-6-bb44c2ab84cc> in <module>()
          1 import urllib.request
    ----> 2 display(levels[4])
          3 f = urllib.request.urlopen(levels[4]+"?nothing=12345")
          4 display(f.read())


    NameError: name 'display' is not defined


Perfect lets get that number and then follow it.... (its 24 characters in I counted)


```python
num="12345"
for i in range(500):
    res=str(urllib.request.urlopen(levels[4]+"?nothing="+num).read())
    num=re.findall('\d+', res)[0]
    display("next is " + levels[4]+"?nothing="+num)

```
    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=44827'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=45439'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=94485'

...

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=23053'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=3875'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=16044'



    ---------------------------------------------------------------------------

    IndexError                                Traceback (most recent call last)

    <ipython-input-33-6d8a7662f94a> in <module>()
          3 for i in range(500):
          4     res=str(urllib.request.urlopen(levels[4]+"?nothing="+num).read())
    ----> 5     num=re.findall('\d+', res)[0]
          6     display("next is " + levels[4]+"?nothing="+num)


    IndexError: list index out of range


Arg the bastards stopped at 16044 and if you click the link it says:

`Yes. Divide by two and keep going.`

Bastards...


```python
num=str(16044/2)
for i in range(500):
    res=str(urllib.request.urlopen(levels[4]+"?nothing="+num).read())
    num=re.findall('\d+', res)[0]
    display("next is " + levels[4]+"?nothing="+num)

```
    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=25357'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=89879'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=80119'

...

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=49574'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=82682'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=82683'



    ---------------------------------------------------------------------------

    IndexError                                Traceback (most recent call last)

    <ipython-input-55-7ea497b55213> in <module>()
          3 for i in range(500):
          4     res=str(urllib.request.urlopen(levels[4]+"?nothing="+num).read())
    ----> 5     num=re.findall('\d+', res)[0]
          6     display("next is " + levels[4]+"?nothing="+num)


    IndexError: list index out of range


It says:

`You've been misleaded to here. Go to previous one and check.`

No!!! Lets see if the "nothing is" matters and we need to change ?nothing=


```python
num="12345"
word="nothing"
for i in range(500):
    res=str(urllib.request.urlopen(levels[4]+"?"+ word +"="+num).read())
    wordPlusQuery=re.findall('\w+ is \d+', res)
    if len(wordPlusQuery) == 0:
        num=str(int(num)/2)
    else:
        word=re.findall('\w+', wordPlusQuery[0])[0]
        num=re.findall('\d+', wordPlusQuery[0])[0]
    display("next is " + levels[4]+"?" + word + "="+num)

```
    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=44827'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=45439'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=94485'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=72198'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=80992'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=8880'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=40961'

...

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=82682'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?example=82683'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?example=41341.5'



    ---------------------------------------------------------------------------

    ValueError                                Traceback (most recent call last)

    <ipython-input-50-5ea7d16925fc> in <module>()
          6     wordPlusQuery=re.findall('\w+ is \d+', res)
          7     if len(wordPlusQuery) == 0:
    ----> 8         num=str(int(num)/2)
          9     else:
         10         word=re.findall('\w+', wordPlusQuery[0])[0]


    ValueError: invalid literal for int() with base 10: '41341.5'


Looking at the message where nothing changes to example we see they were trying to trick us we are only supposed to follow nothing. Lets change our code AGAIN


```python
num="12345"
word="nothing"
for i in range(500):
    res=str(urllib.request.urlopen(levels[4]+"?"+ word +"="+num).read())
    wordPlusQuery=re.findall('nothing is \d+', res)
    if len(wordPlusQuery) == 0:
        n=int(num)/2
        try:
            num=str(int(n))
        except ValueError:
            display(n,res)
            break
    else:
        num=re.findall('\d+', wordPlusQuery[0])[0]
    display("next is " + levels[4]+"?" + word + "="+num)

```
    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=44827'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=45439'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=94485'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=72198'

...

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=16408'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=80109'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=55736'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=15357'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=80887'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=35014'

    Next is http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=16523'


# Level 5

It says banner.p in the source code


```python
import pickle
url = 'http://www.pythonchallenge.com/pc/def/banner.p'
data = pickle.loads(urllib.request.urlopen(url).read())
display(data)

```


    [[(' ', 95)],
     [(' ', 14), ('#', 5), (' ', 70), ('#', 5), (' ', 1)],
     [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)],
     [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)],
     [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)],
     [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)],
     [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)],
     [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)],
     [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)],
     [(' ', 6),
      ('#', 3),
      (' ', 6),
      ('#', 4),
      (' ', 3),
      ('#', 3),
      (' ', 9),
      ('#', 3),
      (' ', 7),
      ('#', 5),
      (' ', 3),
      ('#', 3),
      (' ', 4),
      ('#', 5),
      (' ', 3),
      ('#', 3),
      (' ', 10),
      ('#', 3),
      (' ', 7),
      ('#', 4),
      (' ', 1)],
...
      ('#', 3),
      (' ', 6),
      ('#', 6)],
     [(' ', 95)]]


looks like they just want us to print the  character repeating the number of in the tuple,


```python
for line in data:
    print(''.join(tup[0]*tup[1] for tup in line), end='')

```

                                                                                                                 #####                                                                      #####                ####                                                                       ####                ####                                                                       ####                ####                                                                       ####                ####                                                                       ####                ####                                                                       ####                ####                                                                       ####                ####                                                                       ####       ###      ####   ###         ###       #####   ###    #####   ###          ###       ####    ###   ##    #### #######     ##  ###      #### #######   #### #######     ###  ###     ####   ###     ###  #####    ####   ###   ####    #####    ####  #####    ####   ###     ###   ####  ###           ####     ####   ###    ###    ####     ####  ####     ####  ###      ####  ####  ###           ####     ####          ###    ####     ####  ####     ####  ###       ###  #### ####           ####     ####     ##   ###    ####     ####  ####     #### ####       ###  #### ####           ####     ####   ##########    ####     ####  ####     #### ##############  #### ####           ####     ####  ###    ####    ####     ####  ####     #### ####            #### ####           ####     #### ####     ###    ####     ####  ####     #### ####            ####  ###           ####     #### ####     ###    ####     ####  ####     ####  ###            ####   ###      ##  ####     ####  ###    ####    ####     ####  ####     ####   ###      ##   ####    ###    ##   ####     ####   ###########   ####     ####  ####     ####    ###    ##    ####       ###     ######    #####    ##    #### ######    ###########    #####      ###      ######

#Sweet
It says hannelc. Thats not the answer though.... OK I'm done for a bit. Good couple hours of work
