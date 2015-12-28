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
    var newDiv = $('<div/>').append(outString);
    htmlContainer.append(newDiv);
};

// TextData class
// Object used to store all the Job data for a string printing job.
// @field public - output: The string to print.
// @field public - container: The jQuery html container to print the string to.
// @field public - outputSpeed: An integer representing the number of milliseconds
//      between character prints.
function TextData(stringToPrint, htmlContainer, speedToPrint) {
    this.output = stringToPrint;
    this.container = htmlContainer;
    this.outputSpeed = speedToPrint;
};

// SerialPrintJob class
// Object used to print a series of strings in order.
// @field protected - _textDatas: The list of TextData objects to be printed in order.
function SerialPrintJob(textDatas) {
    this._textDatas = textDatas;

    // __callback private function
    // Prints the next TextData object.
    // @param - job: The reference to the SerialPrintJob that is currently printing.
    this.__callback = function(job) {
        if(job._textDatas.length > 0) {
            var nextTextData = job._textDatas.shift();
            VisualUtils.scrollPrint(nextTextData, job);
        }
        else {
            --system.running;
            VisualUtils.checkIfDone();
        }
    };
    
    // start public function
    // Starts the execution thread of this SerialPrintJob.
    this.start = function() {
        setTimeout(this.__callback, 1, this);
    };
    
    // continue public function
    // Continues the execution of the SerialPrintJob thread.
    this.continue = this.start;
};

// execute function
// Function executes all the queued jobs
VisualUtils.execute = function() {
    system.running += system.jobs.length;
    VisualUtils.removeControl();
    for(var i = 0; i < system.jobs.length; i++) {
        system.jobs[i].start();
    }
    system.jobs = [];
};

// queuePrint function
// Sets up a serially trigged set of print jobs and pushes onto jobs array.
// @param - textDatas: The list of TextData objects that will print.
VisualUtils.queuePrint = function(textDatas) {
    if(!textDatas) { 
        return; 
    }

    var tempJob = new SerialPrintJob(textDatas);
    system.jobs.push(tempJob);
};

// scrollPrint function
// Prints the specified textData object.
// @param - textData: The TextData object containing the string to print.
// @param - printManager: The SerialPrintJob object that contains the callback
//      when done printing.
VisualUtils.scrollPrint = function(textData, printManager) {
    if(textData.output.length > 0) {
        textData.container.append(textData.output[0]);
        textData.container.get(0).scrollIntoView();
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
    if(system.running === 0) {
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
    $('#input').get(0).scrollIntoView();
};

// curDirPrompt function
// Visually sets the prompt with the current directories full path.
VisualUtils.curDirPrompt = function() {
    var curPath = system.curFolder.getPath();
    var newPrompt = curPath + '>&nbsp';
    $('#prompt').html(newPrompt);
};
