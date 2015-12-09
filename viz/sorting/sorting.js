var HIGHLIGHT_NONE = "lightblue";
var HIGHLIGHT_STANDARD = "green";
var HIGHLIGHT_SPECIAL = "#DC143C";
var HIGHLIGHT_SORTED = "orange";
var HIGHLIGHT_LEFT = "#3CB371";
var HIGHLIGHT_RIGHT = "#9932CC";
var HIGHLIGHT_PIVOT = "yellow";
var HIGHLIGHT_GRAY = "#CCCCCC";
var HIGHLIGHT_RAINBOW = [
    "#FF0000",
    "#FF4000",
    "#FF8000",
    "#FFBF00",
    "#FFFF00",
    "#BFFF00",
    "#80FF00",
    "#40FF00",
    "#00FF40",
    "#00FF80",
    "#00FFBF",
    "#00FFFF",
    "#00BFFF",
    "#0080FF",
    "#0040FF",
    "#0000FF",
    "#4000FF",
    "#8000FF",
    "#BF00FF",
    "#FF00FF"
];
var HIGHLIGHT_BLUESHADES = [
    HIGHLIGHT_GRAY,
    HIGHLIGHT_NONE,
    "#9DC4E8",
    "#8EB1EB",
    "#7E9DED",
    "#6E89EF",
    "#5E76F1",
    "#4F62F4",
    "#3F4FF6",
    "#2F3BF8",
    "#1F27FA",
    "#1014FD",
    "#0000FF",
    "#0000FF",
    "#0000FF",
    "#0000FF",
    "#0000FF",
    "#0000FF",
    "#0000FF",
    "#0000FF",
    "#0000FF"
];
var POSITION_USE_PRIMARY = "a";
var POSITION_USE_SECONDARY_IN_DEFAULT_POSITION = "b";
var actionsWidth = 150;
var statusCodetraceWidth = 420;
var isCreateOpen = false;
var isInsertOpen = false;
var isRemoveOpen = false;
var isSortOpen = false;
var Entry = (function () {
    function Entry(value, highlight, position, secondaryPositionStatus) {
        this.value = value;
        this.highlight = highlight;
        this.position = position;
        this.secondaryPositionStatus = secondaryPositionStatus;
    }
    return Entry;
})();
var Backlink = (function () {
    function Backlink(value, highlight, entryPosition, secondaryPositionStatus) {
        this.value = value;
        this.highlight = highlight;
        this.entryPosition = entryPosition;
        this.secondaryPositionStatus = secondaryPositionStatus;
    }
    return Backlink;
})();
var State = (function () {
    function State(entries, backlinks, barsCountOffset, status, lineNo) {
        this.entries = entries;
        this.backlinks = backlinks;
        this.barsCountOffset = barsCountOffset;
        this.status = status;
        this.lineNo = lineNo;
    }
    return State;
})();
var EntryBacklinkHelper = new Object();
var StateHelper = new Object();
var FunctionList = new Object();
EntryBacklinkHelper.appendList = function (entries, backlinks, numArray) {
    for (var i = 0; i < numArray.length; i++) {
        EntryBacklinkHelper.append(entries, backlinks, numArray[i]);
    }
};
EntryBacklinkHelper.append = function (entries, backlinks, newNumber) {
    entries.push(new Entry(newNumber, HIGHLIGHT_NONE, entries.length, POSITION_USE_PRIMARY));
    backlinks.push(new Backlink(newNumber, HIGHLIGHT_NONE, backlinks.length, POSITION_USE_PRIMARY));
};
EntryBacklinkHelper.update = function (entries, backlinks) {
    for (var i = 0; i < backlinks.length; i++) {
        entries[backlinks[i].entryPosition].highlight = backlinks[i].highlight;
        entries[backlinks[i].entryPosition].position = i;
        entries[backlinks[i].entryPosition].secondaryPositionStatus = backlinks[i].secondaryPositionStatus;
    }
};
EntryBacklinkHelper.copyEntry = function (oldEntry) {
    return new Entry(oldEntry.value, oldEntry.highlight, oldEntry.position, oldEntry.secondaryPositionStatus);
};
EntryBacklinkHelper.copyBacklink = function (oldBacklink) {
    return new Backlink(oldBacklink.value, oldBacklink.highlight, oldBacklink.entryPosition, oldBacklink.secondaryPositionStatus);
};
EntryBacklinkHelper.swapBacklinks = function (backlinks, i, j) {
    var swaptemp = backlinks[i];
    backlinks[i] = backlinks[j];
    backlinks[j] = swaptemp;
};
StateHelper.createNewState = function (numArray) {
    var entries = new Array();
    var backlinks = new Array();
    EntryBacklinkHelper.appendList(entries, backlinks, numArray);
    return new State(entries, backlinks, 0, "", 0);
};
StateHelper.copyState = function (oldState) {
    var newEntries = new Array();
    var newBacklinks = new Array();
    for (var i = 0; i < oldState.backlinks.length; i++) {
        newEntries.push(EntryBacklinkHelper.copyEntry(oldState.entries[i]));
        newBacklinks.push(EntryBacklinkHelper.copyBacklink(oldState.backlinks[i]));
    }
    var newLineNo = oldState.lineNo;
    if (newLineNo instanceof Array)
        newLineNo = oldState.lineNo.slice();
    return new State(newEntries, newBacklinks, oldState.barsCountOffset, oldState.status, newLineNo);
};
StateHelper.updateCopyPush = function (list, stateToPush) {
    EntryBacklinkHelper.update(stateToPush.entries, stateToPush.backlinks);
    list.push(StateHelper.copyState(stateToPush));
};
FunctionList.text_y = function (d) {
    var barHeight = this.scaler(d.value);
    if (barHeight < 32)
        return -15;
    return barHeight - 15;
};
FunctionList.g_transform = function (d) {
    if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
        return "translate(" + (centreBarsOffset + d.position * barWidth) + ", " + (maxHeight - this.scaler(d.value)) + ")";
    else if (d.secondaryPositionStatus == POSITION_USE_SECONDARY_IN_DEFAULT_POSITION)
        return "translate(" + (centreBarsOffset + d.position * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - this.scaler(d.value)) + ")";
    else if (d.secondaryPositionStatus >= 0)
        return "translate(" + (centreBarsOffset + d.secondaryPositionStatus * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - this.scaler(d.value)) + ")";
    else if (d.secondaryPositionStatus < 0)
        return "translate(" + ((d.secondaryPositionStatus * -1 - 1) * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - this.scaler(d.value)) + ")";
    else
        return "translate(0, 0)";
};
FunctionList.radixElement_left = function (d) {
    if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
        return d.position * 65 + centreBarsOffset + "px";
    return d.secondaryPositionStatus * 65 + 17.5 + "px";
};
FunctionList.radixElement_bottom = function (d, i) {
    if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
        return 500 - 24 + "px";
    console.log(i + " " + radixSortBucketOrdering[i]);
    return radixSortBucketOrdering[i] * 30 + 5 + "px";
};
FunctionList.radixElement_html = function (d) {
    if (d.highlight == HIGHLIGHT_NONE)
        return d.value;
    var text = "" + d.value;
    while (text.length != 4)
        text = " " + text;
    var positionToHighlight = 0;
    var positionCounter = d.highlight;
    while (positionCounter != 1) {
        positionToHighlight++;
        positionCounter /= 10;
    }
    positionToHighlight = 3 - positionToHighlight;
    if (text.charAt(positionToHighlight) != " ") {
        text = text.slice(0, positionToHighlight)
            + "<span style='color: #B40404;'>"
            + text.charAt(positionToHighlight)
            + "</span>"
            + text.slice(positionToHighlight + 1);
    }
    text = text.trim();
    return text;
};
var makePaler = function (hexColor) {
    var red = Math.floor(parseInt(hexColor.slice(1, 3), 16) + 150);
    var green = Math.floor(parseInt(hexColor.slice(3, 5), 16) + 150);
    var blue = Math.floor(parseInt(hexColor.slice(5, 7), 16) + 150);
    if (red > 255)
        red = 255;
    if (green > 255)
        green = 255;
    if (blue > 255)
        blue = 255;
    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);
    if (red.length == 1)
        red = "0" + red;
    if (green.length == 1)
        green = "0" + green;
    if (blue.length == 1)
        blue = "0" + blue;
    return "#" + red + green + blue;
};
var barWidth = 50;
var maxHeight = 230;
var gapBetweenBars = 5;
var maxNumOfElements = 20;
var gapBetweenPrimaryAndSecondaryRows = 30;
var maxCountingSortElementValue = 9;
var maxRadixSortElementValue = 9999;
var maxElementValue = 50;
var graphElementSize = 10;
var graphElementGap = 2;
var graphRowGap = 10;
var transitionTime = 500;
var currentStep = 0;
var animInterval;
var isPlaying;
var quickSortUseRandomizedPivot;
var mergeSortInversionIndexCounter;
var centreBarsOffset;
var radixSortBucketOrdering;
var isRadixSort = false;
var isCountingSort = false;
var Sorting = (function () {
    function Sorting() {
        this.statelist = new Array();
        this.secondaryStatelist = new Array();
        this.selectedSortFunction = this.bubbleSort;
        this.computeInversionIndex = false;
        this.canvas = d3
            .select("#viz-canvas")
            .attr("height", maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows)
            .attr("width", barWidth * maxNumOfElements);
        this.countingSortSecondaryCanvas = d3
            .select("#viz-counting-sort-secondary-canvas")
            .attr("height", 60)
            .attr("width", barWidth * maxNumOfElements);
        this.radixSortCanvas = d3
            .select("#viz-radix-sort-canvas");
        this.scaler = d3
            .scale
            .linear()
            .range([0, maxHeight]);
        this.drawRadixSortCanvas = function (state, secondaryState) {
            centreBarsOffset = (1000 - (state.entries.length * 65 - 10)) / 2;
            var canvasData = this.radixSortCanvas.selectAll("div").data(state.entries);
            var radixSortBucketCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            radixSortBucketOrdering = new Array(state.backlinks.length);
            for (var i = 0; i < state.backlinks.length; i++) {
                if (state.backlinks.secondaryPositionStatus != POSITION_USE_PRIMARY)
                    radixSortBucketOrdering[state.backlinks[i].entryPosition] = radixSortBucketCount[state.backlinks[i].secondaryPositionStatus]++;
            }
            if (secondaryState)
                $("#radix-sort-bucket-labels-collection").show();
            else
                $("#radix-sort-bucket-labels-collection").hide();
            var exitData = canvasData
                .exit()
                .remove();
            var newData = canvasData
                .enter()
                .append("div")
                .classed({ "radix-sort-element": true })
                .style({
                "left": FunctionList.radixElement_left,
                "bottom": FunctionList.radixElement_bottom
            })
                .html(FunctionList.radixElement_html);
            canvasData
                .html(FunctionList.radixElement_html)
                .transition()
                .style({
                "left": FunctionList.radixElement_left,
                "bottom": FunctionList.radixElement_bottom
            });
        };
        this.generateRandomNumberArray = function (size, limit) {
            var numArray = new Array();
            for (var i = 0; i < size; i++) {
                numArray.push(this.generateRandomNumber(1, limit));
            }
            return numArray;
        };
        this.generateRandomNumber = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.convertToNumber = function (num) {
            return +num;
        };
    }
    Sorting.prototype.drawState = function (stateIndex) {
        if (isRadixSort)
            this.drawRadixSortCanvas(this.statelist[stateIndex], this.secondaryStatelist[stateIndex]);
        else
            this.drawBars(this.statelist[stateIndex]);
        $('#status p').html(this.statelist[stateIndex].status);
        highlightLine(this.statelist[stateIndex].lineNo);
        if (isCountingSort)
            this.drawCountingSortCounters(this.secondaryStatelist[stateIndex]);
    };
    ;
    Sorting.prototype.drawBars = function (state) {
        var _this = this;
        console.error("Drawing bars...");
        this.scaler.domain([0, d3.max(state.entries, function (d) { return d.value; })]);
        centreBarsOffset = (maxNumOfElements - (state.entries.length - state.barsCountOffset)) * barWidth / 2;
        var canvasData = this.canvas.selectAll("g").data(state.entries);
        var exitData = canvasData
            .exit()
            .remove();
        var newData = canvasData
            .enter()
            .append("g")
            .attr("transform", FunctionList.g_transform);
        newData
            .append("rect")
            .attr("height", 0)
            .attr("width", 0);
        newData
            .append("text")
            .attr("dy", ".35em")
            .attr("x", (barWidth - gapBetweenBars) / 2)
            .attr("y", FunctionList.text_y)
            .text(function (d) { return d.value; });
        canvasData
            .select("text")
            .transition()
            .attr("y", FunctionList.text_y)
            .text(function (d) { return d.value; });
        canvasData
            .select("rect")
            .transition()
            .attr("height", function (d) { return _this.scaler(d.value); })
            .attr("width", barWidth - gapBetweenBars)
            .style("fill", function (d) { return d.highlight; });
        canvasData
            .transition()
            .attr("transform", FunctionList.g_transform);
    };
    ;
    Sorting.prototype.drawCountingSortCounters = function (state) {
        var canvasData;
        if (state == null)
            canvasData = this.countingSortSecondaryCanvas.selectAll("text").data([]);
        else
            canvasData = this.countingSortSecondaryCanvas.selectAll("text").data(state);
        var exitData = canvasData
            .exit()
            .remove();
        var newData = canvasData
            .enter()
            .append("text")
            .attr("dy", ".35em")
            .attr("x", function (d, i) { return (i + 5) * barWidth + (barWidth - gapBetweenBars) / 2; })
            .attr("y", 20)
            .text(function (d) { return d; });
        canvasData
            .transition()
            .text(function (d) { return d; });
    };
    ;
    Sorting.prototype.createList = function (type) {
        var numArrayMaxListSize = 20;
        var numArrayMaxElementValue = maxElementValue;
        if (this.selectedSortFunction == this.radixSort) {
            numArrayMaxListSize = 15;
            numArrayMaxElementValue = maxRadixSortElementValue;
        }
        else if (this.selectedSortFunction == this.countingSort) {
            numArrayMaxElementValue = maxCountingSortElementValue;
        }
        var numArray = this.generateRandomNumberArray(this.generateRandomNumber(10, numArrayMaxListSize), numArrayMaxElementValue);
        switch (type) {
            case 'userdefined':
                numArray = $('#userdefined-input').val().split(",");
                if (numArray.length > numArrayMaxListSize) {
                    $("#create-err").html("You can't have more than " + numArrayMaxListSize + " elements!");
                    return false;
                }
                for (var i = 0; i < numArray.length; i++) {
                    var temp = this.convertToNumber(numArray[i]);
                    if (numArray[i].trim() == "") {
                        $("#create-err").html("There seems to be a missing element (a duplicate comma somewhere perhaps?)");
                        return false;
                    }
                    if (isNaN(temp)) {
                        $("#create-err").html("There seems to be an invalid element (not a number): " + numArray[i] + ".");
                        return false;
                    }
                    if (temp < 1 || temp > numArrayMaxElementValue) {
                        $("#create-err").html("Sorry, you're restricted to values between 1 and " + numArrayMaxElementValue + " inclusive. (Out of range number: " + numArray[i] + ".)");
                        return false;
                    }
                    numArray[i] = this.convertToNumber(numArray[i]);
                }
                break;
            case 'random':
                break;
            case 'sorted-increasing':
            case 'nearly-sorted-increasing':
                numArray.sort(d3.ascending);
                break;
            case 'sorted-decreasing':
            case 'nearly-sorted-decreasing':
                numArray.sort(d3.descending);
                break;
        }
        if (type.indexOf("nearly") != -1) {
            while (true) {
                var newNumArray = numArray.slice();
                var numOfSwaps = this.generateRandomNumber(1, 2);
                for (var i = 0; i < numOfSwaps; i++) {
                    var firstSwappingIndex = this.generateRandomNumber(0, newNumArray.length - 4);
                    var secondSwappingIndex = this.generateRandomNumber(1, 3) + firstSwappingIndex;
                    var t = numArray[firstSwappingIndex];
                    newNumArray[firstSwappingIndex] = numArray[secondSwappingIndex];
                    newNumArray[secondSwappingIndex] = t;
                }
                var isEquals = true;
                for (var i = 0; i < numArray.length; i++) {
                    if (numArray[i] != newNumArray[i]) {
                        isEquals = false;
                        break;
                    }
                }
                if (!isEquals) {
                    numArray = newNumArray;
                    break;
                }
            }
        }
        $("#create-err").html("");
        isPlaying = false;
        currentStep = 0;
        this.statelist = [StateHelper.createNewState(numArray)];
        this.secondaryStatelist = [null];
        this.drawState(0);
    };
    Sorting.prototype.setSelectedSortFunction = function (f) {
        this.selectedSortFunction = f;
        isRadixSort = (this.selectedSortFunction == this.radixSort);
        isCountingSort = (this.selectedSortFunction == this.countingSort);
    };
    Sorting.prototype.sort = function () {
        return this.selectedSortFunction();
    };
    Sorting.prototype.radixSort = function () {
        var numElements = this.statelist[0].backlinks.length;
        var state = StateHelper.copyState(this.statelist[0]);
        this.populatePseudocode([
            "create 10 buckets (queues) for each digit (0 to 9)",
            "for each digit placing",
            "  for each element in list",
            "    move element into respective bucket",
            "  for each bucket, starting from smallest digit",
            "    while bucket is non-empty",
            "      restore element to list"
        ]);
        this.secondaryStatelist = [false];
        var currentPlacing = 1;
        var targetPlacing = 1;
        var backlinkBuckets = [[], [], [], [], [], [], [], [], [], []];
        var maxValue = d3.max(state.backlinks, function (d) { return d.value; });
        while (maxValue >= 10) {
            targetPlacing *= 10;
            maxValue = Math.floor(maxValue / 10);
        }
        for (; currentPlacing <= targetPlacing; currentPlacing *= 10) {
            for (var i = 0; i < numElements; i++)
                state.backlinks[i].highlight = currentPlacing;
            StateHelper.updateCopyPush(this.statelist, state);
            this.secondaryStatelist.push(true);
            for (var i = 0; i < numElements; i++) {
                var currentDigit = Math.floor(state.backlinks[i].value / currentPlacing) % 10;
                state.backlinks[i].secondaryPositionStatus = currentDigit;
                backlinkBuckets[currentDigit].push(state.backlinks[i]);
                StateHelper.updateCopyPush(this.statelist, state);
                this.secondaryStatelist.push(true);
            }
            for (var i = 0, j = 0; i <= 9;) {
                if (backlinkBuckets[i].length == 0) {
                    i++;
                    continue;
                }
                state.backlinks[j++] = backlinkBuckets[i].shift();
            }
            for (var i = 0; i < numElements; i++) {
                state.backlinks[i].secondaryPositionStatus = POSITION_USE_PRIMARY;
                StateHelper.updateCopyPush(this.statelist, state);
                this.secondaryStatelist.push(true);
            }
        }
        for (var i = 0; i < numElements; i++)
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        StateHelper.updateCopyPush(this.statelist, state);
        this.secondaryStatelist.push(false);
        this.play();
        return true;
    };
    Sorting.prototype.countingSort = function () {
        var numElements = this.statelist[0].backlinks.length;
        var state = StateHelper.copyState(this.statelist[0]);
        this.populatePseudocode([
            "create key (counting) array",
            "for each element in list",
            "  increase the respective counter by 1",
            "for each counter, starting from smallest key",
            "  while counter is non-zero",
            "    restore element to list",
            "    decrease counter by 1"
        ]);
        var secondaryState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var backlinkBuckets = [[], [], [], [], [], [], [], [], []];
        state.barsCountOffset = maxCountingSortElementValue;
        for (var i = 1; i <= maxCountingSortElementValue; i++) {
            EntryBacklinkHelper.append(state.entries, state.backlinks, i);
            state.backlinks[numElements + i - 1].highlight = HIGHLIGHT_GRAY;
            state.backlinks[numElements + i - 1].secondaryPositionStatus = i * -1 - 5;
        }
        state.lineNo = 1;
        state.status = "Create the key (counting) array (from 1 to 9).";
        StateHelper.updateCopyPush(this.statelist, state);
        this.secondaryStatelist.push(secondaryState.slice());
        for (var i = 0; i < numElements; i++) {
            var currentValue = state.backlinks[i].value;
            backlinkBuckets[currentValue - 1].push(state.backlinks[i]);
            state.backlinks[i].secondaryPositionStatus = currentValue * -1 - 5;
            secondaryState[currentValue - 1]++;
            state.backlinks[currentValue + numElements - 1].highlight = HIGHLIGHT_BLUESHADES[secondaryState[currentValue - 1]];
            state.lineNo = [2, 3];
            state.status = "Increase the counter with key " + currentValue + " by 1.";
            StateHelper.updateCopyPush(this.statelist, state);
            this.secondaryStatelist.push(secondaryState.slice());
        }
        for (var i = 0, j = 0; i < maxCountingSortElementValue;) {
            if (backlinkBuckets[i].length == 0) {
                i++;
                continue;
            }
            state.backlinks[j++] = backlinkBuckets[i].shift();
        }
        for (var i = 0; i < numElements; i++) {
            var currentValue = state.backlinks[i].value;
            state.backlinks[i].secondaryPositionStatus = POSITION_USE_PRIMARY;
            secondaryState[currentValue - 1]--;
            state.backlinks[currentValue + numElements - 1].highlight = HIGHLIGHT_BLUESHADES[secondaryState[currentValue - 1]];
            state.lineNo = [4, 5, 6, 7];
            state.status = "Restore element " + currentValue + ", and decrease the counter with key " + currentValue + " by 1.";
            StateHelper.updateCopyPush(this.statelist, state);
            this.secondaryStatelist.push(secondaryState.slice());
        }
        state.barsCountOffset = 0;
        for (var i = 1; i <= maxCountingSortElementValue; i++) {
            state.entries.pop();
            state.backlinks.pop();
        }
        state.lineNo = 0;
        state.status = "List sorted!";
        StateHelper.updateCopyPush(this.statelist, state);
        this.secondaryStatelist.push(null);
        this.play();
        return true;
    };
    Sorting.prototype.randomizedQuickSort = function () {
        quickSortUseRandomizedPivot = true;
        this.quickSortStart();
        this.play();
        return true;
    };
    Sorting.prototype.quickSort = function () {
        quickSortUseRandomizedPivot = false;
        this.quickSortStart();
        this.play();
        return true;
    };
    Sorting.prototype.quickSortStart = function () {
        var numElements = this.statelist[0].backlinks.length;
        var state = StateHelper.copyState(this.statelist[this.statelist.length - 1]);
        this.populatePseudocode([
            "for each (unsorted) partition",
            "  " + ((quickSortUseRandomizedPivot) ? "randomly select pivot, swap with first element" : "set first element as pivot"),
            "  storeIndex = pivotIndex + 1",
            "  for i = pivotIndex + 1 to rightmostIndex",
            "    if element[i] < element[pivot]",
            "      swap(i, storeIndex); storeIndex++",
            "  swap(pivot, storeIndex - 1)"
        ]);
        this.quickSortSplit(state, 0, numElements - 1);
        state.lineNo = 0;
        state.status = "List sorted!";
        for (var i = 0; i < numElements; i++)
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        StateHelper.updateCopyPush(this.statelist, state);
    };
    Sorting.prototype.quickSortSplit = function (state, startIndex, endIndex) {
        state.status = "Working on partition ["
            + state.backlinks.slice(startIndex, endIndex + 1).map(function (d) {
                return d.value;
            })
            + "] (index " + startIndex + " to " + endIndex + " both inclusive).";
        state.lineNo = 1;
        if (startIndex > endIndex)
            return;
        if (startIndex == endIndex) {
            state.status += " Since partition size == 1, element inside partition is necessarily at sorted position.";
            state.backlinks[startIndex].highlight = HIGHLIGHT_SORTED;
            StateHelper.updateCopyPush(this.statelist, state);
            return;
        }
        var middleIndex = this.quickSortPartition(state, startIndex, endIndex);
        this.quickSortSplit(state, startIndex, middleIndex - 1);
        this.quickSortSplit(state, middleIndex + 1, endIndex);
    };
    Sorting.prototype.quickSortPartition = function (state, startIndex, endIndex) {
        var pivotIndex;
        if (quickSortUseRandomizedPivot) {
            pivotIndex = this.generateRandomNumber(startIndex, endIndex);
            state.status += " Randomly selected " + state.backlinks[pivotIndex].value + " (index " + pivotIndex + ") as pivot.";
            state.lineNo = [1, 2];
            state.backlinks[pivotIndex].highlight = HIGHLIGHT_PIVOT;
            StateHelper.updateCopyPush(this.statelist, state);
            if (pivotIndex != startIndex) {
                state.status = "Swap pivot (" + state.backlinks[pivotIndex].value + ", index " + pivotIndex + ") with first element ("
                    + state.backlinks[startIndex].value + ", index " + startIndex + "). (storeIndex = " + (startIndex + 1) + ".)";
                state.lineNo = [2, 3];
                EntryBacklinkHelper.swapBacklinks(state.backlinks, pivotIndex, startIndex);
                pivotIndex = startIndex;
                StateHelper.updateCopyPush(this.statelist, state);
            }
        }
        else {
            pivotIndex = startIndex;
            state.status += " Selecting " + state.backlinks[pivotIndex].value + " as pivot. (storeIndex = " + (startIndex + 1) + ".)";
            state.lineNo = [1, 2, 3];
            state.backlinks[pivotIndex].highlight = HIGHLIGHT_PIVOT;
            StateHelper.updateCopyPush(this.statelist, state);
        }
        var storeIndex = pivotIndex + 1;
        var pivotValue = state.backlinks[pivotIndex].value;
        for (var i = storeIndex; i <= endIndex; i++) {
            state.status = "Checking if " + state.backlinks[i].value + " < " + pivotValue + " (pivot).";
            state.lineNo = [4, 5];
            state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
            StateHelper.updateCopyPush(this.statelist, state);
            if (state.backlinks[i].value < pivotValue) {
                state.status = state.backlinks[i].value + " < " + pivotValue + " (pivot) is true."
                    + " Swapping index " + i + " (value = " + state.backlinks[i].value + ") with element at storeIndex (index = "
                    + storeIndex + ", value = " + state.backlinks[storeIndex].value + "). (Value of storeIndex after swap = " + (storeIndex + 1) + ").";
                state.lineNo = [4, 6];
                if (i != storeIndex) {
                    EntryBacklinkHelper.swapBacklinks(state.backlinks, storeIndex, i);
                    StateHelper.updateCopyPush(this.statelist, state);
                }
                state.backlinks[storeIndex].highlight = HIGHLIGHT_LEFT;
                storeIndex++;
            }
            else {
                state.backlinks[i].highlight = HIGHLIGHT_RIGHT;
            }
        }
        state.status = "Iteration complete.";
        state.lineNo = 4;
        StateHelper.updateCopyPush(this.statelist, state);
        if (storeIndex - 1 != pivotIndex) {
            state.status = "Swapping pivot (index = " + pivotIndex + ", value = " + pivotValue + ") with element at storeIndex - 1 (index = "
                + (storeIndex - 1) + ", value = " + state.backlinks[storeIndex - 1].value + ").";
            state.lineNo = 7;
            EntryBacklinkHelper.swapBacklinks(state.backlinks, storeIndex - 1, pivotIndex);
            StateHelper.updateCopyPush(this.statelist, state);
        }
        state.status = "Pivot is now at its sorted position.";
        state.lineNo = 7;
        for (var i = startIndex; i <= endIndex; i++)
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        state.backlinks[storeIndex - 1].highlight = HIGHLIGHT_SORTED;
        StateHelper.updateCopyPush(this.statelist, state);
        return storeIndex - 1;
    };
    Sorting.prototype.mergeSort = function () {
        var numElements = this.statelist[0].backlinks.length;
        var state = StateHelper.copyState(this.statelist[0]);
        this.populatePseudocode([
            "split each element into partitions of size 1",
            "recursively merge adjancent partitions",
            "  for i = leftPartStartIndex to rightPartLastIndex inclusive",
            "    if leftPartHeadValue <= rightPartHeadValue",
            "      copy leftPartHeadValue",
            "    else: copy rightPartHeadValue" + ((this.computeInversionIndex) ? "; Increase InvIdx" : ""),
            "copy elements back to original array"
        ]);
        mergeSortInversionIndexCounter = 0;
        for (var i = 0; i < numElements; i++) {
            state.backlinks[i].highlight = HIGHLIGHT_RAINBOW[i];
        }
        state.status = "We split the array into partitions of 1 (each partition takes on a distinct color).";
        debugger;
        StateHelper.updateCopyPush(this.statelist, state);
        this.mergeSortSplitMerge(state, 0, numElements);
        for (var i = 0; i < numElements; i++)
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        state.status = "List sorted!";
        if (this.computeInversionIndex) {
            state.status += " (Inversion Index = " + mergeSortInversionIndexCounter + ".)";
        }
        state.lineNo = 0;
        StateHelper.updateCopyPush(this.statelist, state);
        this.play();
        return true;
    };
    Sorting.prototype.mergeSortSplitMerge = function (state, startIndex, endIndex) {
        if (endIndex - startIndex <= 1)
            return;
        var middleIndex = Math.ceil((startIndex + endIndex) / 2);
        this.mergeSortSplitMerge(state, startIndex, middleIndex);
        this.mergeSortSplitMerge(state, middleIndex, endIndex);
        this.mergeSortMerge(state, startIndex, middleIndex, endIndex);
        state.status = "We copy the elements from the new array back into the original array.";
        state.lineNo = 7;
        var duplicateBacklinks = new Array();
        for (var i = startIndex; i < endIndex; i++) {
            var newPosition = state.backlinks[i].secondaryPositionStatus;
            duplicateBacklinks[newPosition] = state.backlinks[i];
        }
        for (var i = startIndex; i < endIndex; i++) {
            state.backlinks[i] = duplicateBacklinks[i];
        }
        for (var i = startIndex; i < endIndex; i++) {
            state.backlinks[i].secondaryPositionStatus = POSITION_USE_PRIMARY;
            StateHelper.updateCopyPush(this.statelist, state);
        }
    };
    Sorting.prototype.mergeSortMerge = function (state, startIndex, middleIndex, endIndex) {
        var leftIndex = startIndex;
        var rightIndex = middleIndex;
        var newHighlightColor = state.backlinks[startIndex].highlight;
        state.status = "We now merge partitions ["
            + state.backlinks.slice(startIndex, middleIndex).map(function (d) {
                return d.value;
            })
            + "] (index " + startIndex + " to " + (middleIndex - 1) + " both inclusive) and ["
            + state.backlinks.slice(middleIndex, endIndex).map(function (d) {
                return d.value;
            })
            + "] (index " + middleIndex + " to " + (endIndex - 1) + " both inclusive).";
        state.lineNo = 2;
        state.backlinks[leftIndex].highlight = makePaler(state.backlinks[leftIndex].highlight);
        state.backlinks[rightIndex].highlight = makePaler(state.backlinks[rightIndex].highlight);
        StateHelper.updateCopyPush(this.statelist, state);
        for (var i = startIndex; i < endIndex; i++) {
            if (leftIndex < middleIndex && (rightIndex >= endIndex || state.backlinks[leftIndex].value <= state.backlinks[rightIndex].value)) {
                state.backlinks[leftIndex].highlight = newHighlightColor;
                state.backlinks[leftIndex].secondaryPositionStatus = i;
                if (rightIndex < endIndex) {
                    state.status = "Since " + state.backlinks[leftIndex].value + " (left partition) <= " + state.backlinks[rightIndex].value
                        + " (right partition), we copy " + state.backlinks[leftIndex].value + " into new array.";
                }
                else {
                    state.status = "Since right partition is empty, we copy " + state.backlinks[leftIndex].value + " (left partition) into new array.";
                }
                state.lineNo = [3, 4, 5];
                leftIndex++;
                if (leftIndex != middleIndex)
                    state.backlinks[leftIndex].highlight = makePaler(state.backlinks[leftIndex].highlight);
                StateHelper.updateCopyPush(this.statelist, state);
            }
            else {
                state.backlinks[rightIndex].highlight = newHighlightColor;
                state.backlinks[rightIndex].secondaryPositionStatus = i;
                if (leftIndex < middleIndex) {
                    state.status = "Since " + state.backlinks[leftIndex].value + " (left partition) > " + state.backlinks[rightIndex].value
                        + " (right partition), we copy " + state.backlinks[rightIndex].value + " into new array.";
                }
                else {
                    state.status = "Since left partition is empty, we copy " + state.backlinks[leftIndex].value + " (right partition) into new array.";
                }
                if (this.computeInversionIndex) {
                    mergeSortInversionIndexCounter += middleIndex - leftIndex;
                    state.status += " (We add size_of_left_partition (= " + (middleIndex - leftIndex) + ") to the inversionIndexCounter (" + mergeSortInversionIndexCounter + ").)";
                }
                else {
                    state.status += "wierd";
                }
                state.lineNo = [3, 6];
                rightIndex++;
                if (rightIndex != endIndex)
                    state.backlinks[rightIndex].highlight = makePaler(state.backlinks[rightIndex].highlight);
                StateHelper.updateCopyPush(this.statelist, state);
            }
        }
    };
    Sorting.prototype.insertionSort = function () {
        var numElements = this.statelist[0].backlinks.length;
        var state = StateHelper.copyState(this.statelist[0]);
        this.populatePseudocode([
            "mark first element as sorted",
            "for each unsorted element",
            "  'extract' the element",
            "  for i = lastSortedIndex to 0",
            "    if currentSortedElement > extractedElement",
            "      move sorted element to the right by 1",
            "    else: insert extracted element"
        ]);
        state.lineNo = 1;
        state.status = "Mark the first element (" + state.backlinks[0].value + ") as sorted.";
        state.backlinks[0].highlight = HIGHLIGHT_SORTED;
        StateHelper.updateCopyPush(this.statelist, state);
        for (var i = 1; i < numElements; i++) {
            state.lineNo = [2, 3];
            state.status = "Extract the first unsorted element (" + state.backlinks[i].value + ").";
            state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
            state.backlinks[i].secondaryPositionStatus = POSITION_USE_SECONDARY_IN_DEFAULT_POSITION;
            StateHelper.updateCopyPush(this.statelist, state);
            for (var j = i - 1; j >= 0; j--) {
                state.lineNo = 4;
                state.status = "Figure where to insert extracted element; comparing with sorted element " + state.backlinks[j].value + ".";
                state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
                StateHelper.updateCopyPush(this.statelist, state);
                if (state.backlinks[j].value > state.backlinks[j + 1].value) {
                    state.lineNo = [5, 6];
                    state.status = state.backlinks[j].value + " > " + state.backlinks[j + 1].value + " is true, hence move current sorted element (" + state.backlinks[j].value + ") to the right by 1.";
                    EntryBacklinkHelper.swapBacklinks(state.backlinks, j, j + 1);
                    StateHelper.updateCopyPush(this.statelist, state);
                    state.backlinks[j + 1].highlight = HIGHLIGHT_SORTED;
                }
                else {
                    state.lineNo = 7;
                    state.status = state.backlinks[j].value + " > " + state.backlinks[j + 1].value + " is false, insert element at current position.";
                    state.backlinks[j].highlight = HIGHLIGHT_SORTED;
                    state.backlinks[j + 1].secondaryPositionStatus = POSITION_USE_PRIMARY;
                    state.backlinks[j + 1].highlight = HIGHLIGHT_SORTED;
                    StateHelper.updateCopyPush(this.statelist, state);
                    break;
                }
            }
            if (state.backlinks[0].secondaryPositionStatus == POSITION_USE_SECONDARY_IN_DEFAULT_POSITION) {
                state.lineNo = 4;
                state.status = "At beginning of array (nothing to compare), hence insert element at current position.";
                state.backlinks[0].secondaryPositionStatus = POSITION_USE_PRIMARY;
                state.backlinks[0].highlight = HIGHLIGHT_SORTED;
                StateHelper.updateCopyPush(this.statelist, state);
            }
        }
        for (var i = 0; i < numElements; i++)
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        state.lineNo = 0;
        state.status = "List sorted!";
        StateHelper.updateCopyPush(this.statelist, state);
        this.play();
        return true;
    };
    Sorting.prototype.selectionSort = function () {
        var numElements = this.statelist[0].backlinks.length;
        var state = StateHelper.copyState(this.statelist[0]);
        console.log("selection sort");
        this.populatePseudocode([
            "repeat (numOfElements - 1) times",
            "  set the first unsorted element as the minimum",
            "  for each of the unsorted elements",
            "    if element < currentMinimum",
            "      set element as new minimum",
            "  swap minimum with first unsorted position"
        ]);
        for (var i = 0; i < numElements - 1; i++) {
            var minPosition = i;
            state.status = "Iteration " + (i + 1) + ": Set " + state.backlinks[i].value + " as the current minimum, then iterate through the remaining unsorted elements to find the true minimum.";
            state.lineNo = [1, 2, 3];
            state.backlinks[minPosition].highlight = HIGHLIGHT_SPECIAL;
            StateHelper.updateCopyPush(this.statelist, state);
            for (var j = i + 1; j < numElements; j++) {
                state.status = "Check if " + state.backlinks[j].value + " is smaller than the current minimum (" + state.backlinks[minPosition].value + ").";
                state.lineNo = 4;
                state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
                StateHelper.updateCopyPush(this.statelist, state);
                state.backlinks[j].highlight = HIGHLIGHT_NONE;
                if (state.backlinks[j].value < state.backlinks[minPosition].value) {
                    state.status = "Set " + state.backlinks[j].value + " as the new minimum.";
                    state.lineNo = 5;
                    state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
                    state.backlinks[j].highlight = HIGHLIGHT_SPECIAL;
                    minPosition = j;
                    StateHelper.updateCopyPush(this.statelist, state);
                }
            }
            if (minPosition != i) {
                state.status = "Swap the minimum (" + state.backlinks[minPosition].value + ") with the first unsorted element (" + state.backlinks[i].value + ").";
                state.lineNo = 6;
                state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
                StateHelper.updateCopyPush(this.statelist, state);
                EntryBacklinkHelper.swapBacklinks(state.backlinks, minPosition, i);
                StateHelper.updateCopyPush(this.statelist, state);
            }
            else {
                state.status = "As the minimum is the first unsorted element, no swap is necessary.";
                state.lineNo = 6;
                StateHelper.updateCopyPush(this.statelist, state);
            }
            state.status = state.backlinks[i].value + " is now considered sorted.";
            state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
            state.backlinks[i].highlight = HIGHLIGHT_SORTED;
            StateHelper.updateCopyPush(this.statelist, state);
        }
        for (var i = 0; i < numElements; i++)
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        state.status = "List sorted! (After all iterations, the last element will naturally be sorted.)";
        debugger;
        StateHelper.updateCopyPush(this.statelist, state);
        this.play();
        return true;
    };
    Sorting.prototype.bubbleSort = function () {
        var numElements = this.statelist[0].backlinks.length;
        var state = StateHelper.copyState(this.statelist[0]);
        var swapCounter = 0;
        this.populatePseudocode([
            "do",
            "  swapped = false",
            "  for i = 1 to indexOfLastUnsortedElement",
            "    if leftElement > rightElement",
            "      swap(leftElement, rightElement)",
            "      swapped = true" + ((this.computeInversionIndex) ? "; swapCounter++" : ""),
            "while swapped"
        ]);
        var swapped;
        var indexOfLastUnsortedElement = numElements;
        do {
            swapped = false;
            state.status = "Set the swapped flag to false. Then iterate from 1 to " + (numElements - 1) + " inclusive.";
            state.lineNo = [2, 3];
            StateHelper.updateCopyPush(this.statelist, state);
            for (var i = 1; i < indexOfLastUnsortedElement; i++) {
                state.backlinks[i - 1].highlight = HIGHLIGHT_STANDARD;
                state.backlinks[i].highlight = HIGHLIGHT_STANDARD;
                state.status = "Checking if " + state.backlinks[i - 1].value + " > " + state.backlinks[i].value + "; swap the elements if so. (Current value of swapped = " + swapped + ").";
                state.lineNo = 4;
                StateHelper.updateCopyPush(this.statelist, state);
                if (state.backlinks[i - 1].value > state.backlinks[i].value) {
                    swapped = true;
                    state.status = "Swapping " + state.backlinks[i - 1].value + " & " + state.backlinks[i].value + " positions. Setting swapped to true.";
                    if (this.computeInversionIndex) {
                        swapCounter++;
                        state.status += " (For inversion index: Add 1 to swapCounter. Current value of swapCounter = " + swapCounter + ".)";
                    }
                    state.lineNo = [5, 6];
                    EntryBacklinkHelper.swapBacklinks(state.backlinks, i, i - 1);
                    StateHelper.updateCopyPush(this.statelist, state);
                }
                state.backlinks[i - 1].highlight = HIGHLIGHT_NONE;
                state.backlinks[i].highlight = HIGHLIGHT_NONE;
            }
            indexOfLastUnsortedElement--;
            state.backlinks[indexOfLastUnsortedElement].highlight = HIGHLIGHT_SORTED;
            if (swapped == false)
                state.status = "No swap is done in this pass, we can terminate Bubble Sort now";
            else
                state.status = "Mark last unsorted element as sorted. As at least one swap is done in recent pass, we run another pass";
            state.lineNo = 7;
            StateHelper.updateCopyPush(this.statelist, state);
        } while (swapped);
        for (var i = 0; i < numElements; i++)
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        state.status = "List sorted!";
        if (this.computeInversionIndex)
            state.status += " (Inversion Index = " + swapCounter + ".)";
        state.lineNo = 0;
        StateHelper.updateCopyPush(this.statelist, state);
        this.play();
        return true;
    };
    Sorting.prototype.clearPseudocode = function () { this.populatePseudocode([]); };
    Sorting.prototype.populatePseudocode = function (code) {
        var i = 1;
        for (; i <= 7 && i <= code.length; i++) {
            $("#code" + i).html(code[i - 1].replace(/^\s+/, function (m) { return m.replace(/\s/g, "&nbsp;"); }));
        }
        for (; i <= 7; i++) {
            $("#code" + i).html("");
        }
    };
    Sorting.prototype.drawCurrentState = function () {
        $('#progress-bar').slider("value", currentStep);
        this.drawState(currentStep);
        if (currentStep == (this.statelist.length - 1)) {
            this.pause();
            $('#play img').attr('src', 'img/replay.png').attr('alt', 'replay').attr('title', 'replay');
        }
        else
            $('#play img').attr('src', 'img/play.png').attr('alt', 'play').attr('title', 'play');
    };
    Sorting.prototype.getAnimationDuration = function () { return transitionTime; };
    Sorting.prototype.setAnimationDuration = function (x) {
        var _this = this;
        transitionTime = x;
        if (isPlaying) {
            clearInterval(animInterval);
            animInterval = setInterval(function () {
                _this.drawCurrentState();
                if (currentStep < (_this.statelist.length - 1))
                    currentStep++;
                else
                    clearInterval(animInterval);
            }, transitionTime);
        }
    };
    Sorting.prototype.getCurrentIteration = function () { return currentStep; };
    Sorting.prototype.getTotalIteration = function () { return this.statelist.length; };
    Sorting.prototype.forceNext = function () {
        if ((currentStep + 1) < this.statelist.length)
            currentStep++;
        this.drawCurrentState();
    };
    Sorting.prototype.forcePrevious = function () {
        if ((currentStep - 1) >= 0)
            currentStep--;
        this.drawCurrentState();
    };
    Sorting.prototype.jumpToIteration = function (n) {
        currentStep = n;
        this.drawCurrentState();
    };
    Sorting.prototype.play = function () {
        var _this = this;
        isPlaying = true;
        this.drawCurrentState();
        animInterval = setInterval(function () {
            _this.drawCurrentState();
            if (currentStep < (_this.statelist.length - 1))
                currentStep++;
            else
                clearInterval(animInterval);
        }, transitionTime);
    };
    Sorting.prototype.pause = function () {
        isPlaying = false;
        clearInterval(animInterval);
    };
    Sorting.prototype.replay = function () {
        var _this = this;
        isPlaying = true;
        currentStep = 0;
        this.drawCurrentState();
        animInterval = setInterval(function () {
            _this.drawCurrentState();
            if (currentStep < (_this.statelist.length - 1))
                currentStep++;
            else
                clearInterval(animInterval);
        }, transitionTime);
    };
    Sorting.prototype.stop = function () {
        isPlaying = false;
        this.statelist = [this.statelist[0]];
        this.secondaryStatelist = [null];
        currentStep = 0;
        this.drawState(0);
    };
    return Sorting;
})();
$(function () {
    hideAllSubmenus();
    $('#title-Bubble').click();
    $('#play').hide();
    d3.selectAll("#radix-sort-bucket-labels-collection span")
        .style({
        "left": function (d, i) {
            return 17.5 + i * 65 + "px";
        }
    });
    var sortMode = getQueryVariable("mode");
    if (sortMode.length > 0) {
        $('#title-' + sortMode).click();
    }
    var createArray = getQueryVariable("create");
    if (createArray.length > 0) {
        $('#userdefined-input').val(createArray);
        createList("userdefined");
    }
    $('#create').click(function () {
        console.log("HIT");
        closeInsert();
        closeRemove();
        closeSort();
        openCreate();
    });
    $('#insert').click(function () {
        closeCreate();
        closeRemove();
        closeSort();
        openInsert();
    });
    $('#remove').click(function () {
        closeCreate();
        closeInsert();
        closeSort();
        openRemove();
    });
    $('#sort').click(function () {
        closeCreate();
        closeInsert();
        closeRemove();
        openSort();
    });
    $('#tutorial-2 .tutorial-next').click(showActionsPanel);
    $('#tutorial-3 .tutorial-next').click(hideEntireActionsPanel);
    $('#tutorial-4 .tutorial-next').click(showStatusPanel);
    $('#tutorial-5 .tutorial-next').click(function () {
        hideStatusPanel();
        showCodetracePanel();
    });
    $('#tutorial-6 .tutorial-next').click(hideCodetracePanel);
    $('#title-Bubble').click(function () {
        console.log("title changing");
        showStandardCanvas();
        $("#sort-bubble-merge-inversion").css("display", "");
        $('#current-action p').html("Bubble Sort");
        changeSortType(gw.bubbleSort);
    });
    $('#title-Selection').click(function () {
        showStandardCanvas();
        hideAllSortingOptions();
        $('#current-action p').html("Selection Sort");
        changeSortType(gw.selectionSort);
    });
    $('#title-Insertion').click(function () {
        showStandardCanvas();
        hideAllSortingOptions();
        $('#current-action p').html("Insertion Sort");
        changeSortType(gw.insertionSort);
    });
    $('#title-Merge').click(function () {
        showStandardCanvas();
        hideAllSortingOptions();
        $("#sort-bubble-merge-inversion").css("display", "");
        $('#current-action p').html("Merge Sort");
        changeSortType(gw.mergeSort);
    });
    $('#title-Quick').click(function () {
        showStandardCanvas();
        hideAllSortingOptions();
        $('#current-action p').html("Quick Sort");
        changeSortType(gw.quickSort);
    });
    $('#title-RandomizedQuick').click(function () {
        showStandardCanvas();
        hideAllSortingOptions();
        $('#current-action p').html("Randomized Quick Sort");
        changeSortType(gw.randomizedQuickSort);
    });
    $('#title-Counting').click(function () {
        showStandardCanvas();
        $("#viz-counting-sort-secondary-canvas").show();
        hideAllSortingOptions();
        $('#current-action p').html("Counting Sort");
        changeSortType(gw.countingSort, "2, 3, 8, 7, 1, 2, 2, 2, 7, 3, 9, 8, 2, 1, 4, 2, 4, 6, 9, 2");
    });
    $('#title-Radix').click(function () {
        hideAllCanvases();
        $("#viz-radix-sort-canvas").show();
        hideAllSortingOptions();
        $('#current-action p').html("Radix Sort");
        changeSortType(gw.radixSort, "3221, 1, 10, 9680, 577, 9420, 7, 5622, 4793, 2030, 3138, 82, 2599, 743, 4127");
    });
    if (!localStorage.getItem("sortingvisited")) {
        localStorage.setItem("sortingvisited", "true");
        setTimeout(function () {
            $("#mode-menu a").trigger("click");
        }, 2000);
    }
});
var gw = new Sorting();
function hideAllSubmenus() {
    $(".create").css("bottom", "92px");
    $("#create-sorted-increasing").hide();
    $("#create-sorted-decreasing").hide();
    $("#create-nearly-sorted-increasing").hide();
    $("#create-nearly-sorted-decreasing").hide();
}
function hideAllSortingOptions() {
    $("#sort-bubble-merge-inversion").css("display", "none");
}
function hideAllCanvases() {
    $("#viz-canvas").hide();
    $("#viz-counting-sort-secondary-canvas").hide();
    $("#viz-radix-sort-canvas").hide();
}
function showStandardCanvas() {
    $("#viz-canvas").show();
    $("#viz-counting-sort-secondary-canvas").hide();
    $("#viz-radix-sort-canvas").hide();
}
function changeSortType(newSortingFunction, customNumberList) {
    if (!customNumberList)
        $('#userdefined-input').val("3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48");
    else
        $('#userdefined-input').val(customNumberList);
    createList('userdefined');
    if (isPlaying)
        stop();
    showActionsPanel();
    hideStatusPanel();
    hideCodetracePanel();
    gw.clearPseudocode();
    gw.setSelectedSortFunction(newSortingFunction);
}
function createList(type) {
    if (isPlaying)
        stop();
    setTimeout(function () {
        if ((mode == "exploration") && gw.createList(type)) {
            $('#progress-bar').slider("option", "max", 0);
            closeCreate();
            isPlaying = false;
        }
    }, 500);
}
function sort() {
    gw.computeInversionIndex = $('#sort-bubble-merge-inversion-checkbox').prop('checked');
    if (isPlaying)
        stop();
    setTimeout(function () {
        if ((mode == "exploration") && gw.sort()) {
            $('#current-action').show();
            $('#progress-bar').slider("option", "max", gw.getTotalIteration() - 1);
            triggerRightPanels();
            isPlaying = true;
        }
    }, 500);
}
var lastSubmenuShown = null;
function triggerSubmenu(which) {
    hideAllSubmenus();
    if (lastSubmenuShown == which) {
        lastSubmenuShown = null;
        return;
    }
    lastSubmenuShown = which;
    $(".create").css("bottom", "60px");
    if (which == "sorted") {
        $("#create-sorted-increasing").show();
        $("#create-sorted-decreasing").show();
    }
    else if (which == "nearly-sorted") {
        $("#create-nearly-sorted-increasing").show();
        $("#create-nearly-sorted-decreasing").show();
    }
}
function openCreate() {
    if (!isCreateOpen) {
        $('.create').fadeIn('fast');
        isCreateOpen = true;
    }
}
function closeCreate() {
    if (isCreateOpen) {
        $('.create').fadeOut('fast');
        $('#create-err').html("");
        isCreateOpen = false;
    }
}
function openInsert() {
    if (!isInsertOpen) {
        $('.insert').fadeIn('fast');
        isInsertOpen = true;
    }
}
function closeInsert() {
    if (isInsertOpen) {
        $('.insert').fadeOut('fast');
        $('#insert-err').html("");
        isInsertOpen = false;
    }
}
function openRemove() {
    if (!isRemoveOpen) {
        $('.remove').fadeIn('fast');
        isRemoveOpen = true;
    }
}
function closeRemove() {
    if (isRemoveOpen) {
        $('.remove').fadeOut('fast');
        $('#remove-err').html("");
        isRemoveOpen = false;
    }
}
function openSort() {
    if (!isSortOpen) {
        $('.sort').fadeIn('fast');
        isSortOpen = true;
    }
}
function closeSort() {
    if (isSortOpen) {
        $('.sort').fadeOut('fast');
        $('#sort-err').html("");
        isSortOpen = false;
    }
}
function hideEntireActionsPanel() {
    closeCreate();
    closeInsert();
    closeRemove();
    closeSort();
    hideActionsPanel();
}
