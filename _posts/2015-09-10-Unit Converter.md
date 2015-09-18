---
layout: post
title: Javascript/HTML - Unit Converter
summary: Make a simple converter
tags: ["howto", "code", "programming", "javascript"]
---
#Make a simple unit converter

The other day a friend of mine asked about a better site for unit conversion calculations relating to a project we were working on.

I was bored so made a simple unit converter! I don't particularly enjoy design work so haven't done that, but that should be simple. I use jQuery, because it simplifies DOM interaction.

```
unitDict = {}
     Key: Unit Name
     Value: {
                 dom: JQuery for textarea,
                 ratio: Unit Ratio
            }
```

This unitDict will store each unit's textarea, where a user can type a value, and hit enter, updating the rest of the units to be based on there unitRatios.

Now, lets look at how we will make these textareas and handle there control logic.

```javascript
function makeUnit(name, ratio){
    var div = $("<div>").appendTo("body")[0];
    $("<label>").appendTo(div).text(name);
    unitDict[name] = {
        dom: $('<input>', {
            type: "text",
        }).keydown(function (event) {
            if ((event.keyCode || event.which) == 13)
            //on enter search map and update values
                for(var unit in unitDict) if(unitDict.hasOwnProperty(unit))
                    unitDict[unit].dom.val((+$(this).val()) * ratio / unitDict[unit].ratio)
        }).appendTo(div).val(1 * ratio),
        ratio: ratio
    }
}
```

Lets break that down.

1. First, we want to make a div for this unit. For the sake of a clean API, I chose to append it to the body div directly here. We also want to append a label to this div with the unit's name so that the div is `["cm" [text input]]`.

    ```javascript
    var div = $("<div>").appendTo("body")[0];
    $("<label>").appendTo(div).text(name);
    ```

2. Next we want to add that text input to the div. We also want to store it in to the unitMap, so lets do that now!

    ```javascript
    unitMap[name] = {
        dom: $('<input>', {
            type: "text",
        }).keydown(function (event) {
            if ((event.keyCode || event.which) == 13) //on enter search map and update values
                for(var unit in unitMap) if(unitMap.hasOwnProperty(unit))
                    unitMap[unit].dom.val((+$(this).val()) * ratio / unitMap[unit].ratio)
        }).appendTo(div).val(1 * ratio),
        ratio: ratio
    }
    ```

    Lets look closer at what we are doing.
    1. First we make an input div.

        ```javascript
        $('<input>', {
            type: "text",
        })
        ```

    2. Then we attach a listener to it's keydown event. In it, we check if the key pressed was the enter key, then iterate over the unitMap, setting each value to `entered_value * enter_unitRatio / thisUnitRatio`

        ```javascript
        keydown(function (event) {
            if ((event.keyCode || event.which) == 13)
            //on enter search map and update values
                for(var unit in unitMap) if(unitMap.hasOwnProperty(unit))
                    unitMap[unit].dom.val((+$(this).val()) * ratio / unitMap[unit].ratio)
        })
        ```

    3. Add this new input div to the individual div

        ```javascript
        appendTo(div).val(1 * ratio),
        ```

3. Now, all we have to do is define some units to display.

    ```javascript
    //base is cm
    makeUnit("cm", 1);
    makeUnit("mm", .1);
    makeUnit("in", 2.54);
    makeUnit("m", 100);
    ```

A simple example is up [here](/convert.html)
