---
layout: post
title: The Julia Function, Julia Set, and Julia Fractal, written in Javascript
summary: Make a Julia Fractal again!
tags: ["howto", "code", "programming", "javascript"]
---
<label for="sizeX" style="float:left"> Width</label><input type="text" id="sizeX" style="float:left"/>
<label for="sizeY" style="float:left"> Height</label><input type="text" id="sizeY" style="float:left"/><br>
<label for="xIncr" style="float:left"> XIncr</label><input type="text" id="xIncr" style="float:left"/>
<label for="yIncr" style="float:left"> YIncr</label><input type="text" id="yIncr" style="float:left"/><br>
<label for="iLimit" style="float:left"> i Limit</label><input type="text" id="iLimit" style="float:left"/>
<label for="rLimit" style="float:left"> r Limit</label><input type="text" id="rLimit" style="float:left"/><br>
<label for="constantR" style="float:left"> ConstantR</label><input type="text" id="constantR" style="float:left"/>
<label for="constantI" style="float:left"> ConstantI</label><input type="text" id="constantI" style="float:left"/><br>

<canvas id="fractal">

#Julia is great, but for flexible vizualisation, a browser is awesome!

So I"m adapting the code in my last post to Javascript and making a more
configurable. Its pretty slow unfortunately. :(  It'll get better when I put some more time into it!

<script src="/public/js/fractal.js"> </script>
