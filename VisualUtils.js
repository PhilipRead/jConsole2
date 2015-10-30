// clearInput function
// Clears any text from the input container.
VisualUtils.clearInput = function() {
    $('#input').html('');
};

// outputNewLines function
// Appends the specified number of blank lines to the specified container.
// @param - numLines: The number of blank lines to append.
// @param - htmlContainer: The container to append to.
VisualUtils.outputNewLines = function(numLines, htmlContainer) {
    for(var i=0; i<numLines; i++) {
        htmlContainer.append('</br>');
    }
};

// flashOutput function
// Appends text to the specified container instantly, i.e. not scrolling.
// @param - outString: The string to print.
// @param - htmlContainer: The container to print to.
VisualUtils.flashOutput = function(outString, htmlContainer) {
    htmlContainer.append('<div>' + outString + '</div>');
};

// TextData class
// Object used to store all the Job data for a string printing job.
// @field - output: The string to print.
// @field - container: The jQuery html container to print the string to.
// @field - outputSpeed: An integer representing the number of milliseconds
//      between character prints.
function TextData(stringToPrint, htmlContainer, speedToPrint) {
    this.output = stringToPrint;
    this.container = htmlContainer;
    this.outputSpeed = speedToPrint;
};

// SerialPrintJob class
// Object used to print a series of strings in order.
// @field - textDatas: The list of TextData objects to be printed in order.
// @function - callback: The function that prints the next TextData object.
// @function - start: The function that begins the printing of the TextData objects.
// @function - continue: The function is the same as the start function. Added
//      for clarity when continuing the serial print job.
function SerialPrintJob(textDatas) {
    this.textDatas = textDatas;
    this.callback = function(job) {
        if(job.textDatas.length > 0) {
            var nextTextData = job.textDatas.shift();
            VisualUtils.scrollPrint(nextTextData, job);
        }
        else {
            --running;
            VisualUtils.checkIfDone();
        }
    };
    this.start = function() {
        setTimeout(this.callback, 1, this);
    };
    this.continue = this.start;
};

// execute function
// Function executes all the queued jobs
VisualUtils.execute = function() {
    running += jobs.length;
    VisualUtils.removeControl();
    for(var i = 0; i < jobs.length; i++) {
        jobs[i].start();
    }
    jobs = [];
};

// queuePrint function
// Sets up a serially trigged set of print jobs and pushes onto jobs array.
// @param - textDatas: The list of TextData objects that will print.
VisualUtils.queuePrint = function(textDatas) {
    if(textDatas == null) { return; }

    var tempJob = new SerialPrintJob(textDatas);
    jobs.push(tempJob);
};

// scrollPrint function
// Prints the specified textData object.
// @param - textData: The TextData object containing the string to print.
// @param - printManager: The SerialPrintJob object that contains the callback
//      when done printing.
VisualUtils.scrollPrint = function(textData, printManager) {
    if(textData.output.length > 0) {
        textData.container.append(textData.output[0]);
        textData.output = textData.output.slice(1);
        setTimeout(VisualUtils.scrollPrint, textData.outputSpeed, textData, printManager);
    }
    else {
        textData.container.html(textData.container.text());
        printManager.continue();
    }
};

// checkIfDone function
// Detects if printing is completed and returns control if it is.
VisualUtils.checkIfDone = function() {
    if(running == 0) {
        VisualUtils.returnControl();
    }
};

// removeControl function
// Removes the ability of the user to enter commands.
VisualUtils.removeControl = function() {
    $('#input').attr('contenteditable', 'false');
    $('#input').off('keydown', KeyUtils.inputKeyDownHandler)
    $('#prompt').html('');
};

// returnControl function
// Gives back the ability of the user to enter commands.
VisualUtils.returnControl = function() {
    VisualUtils.outputNewLines(1, $('#output'));
    $('#prompt').html('>&nbsp');
    $('#input').attr('contenteditable', 'plaintext-only');
    $('#input').focus();
    $('#input').on('keydown', KeyUtils.inputKeyDownHandler);
};
