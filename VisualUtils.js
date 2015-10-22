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
	var i;
	for(i=0; i<numLines; i++) {
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

// printOutput function
// Prints text asynchronously to the specified containers.
// @param - textDataList: A list of TextData objects to be printed.
VisualUtils.printOutput = function(textDataList) {
	var i;
	for(i=0; i<textDataList.length; i++) {
		VisualUtils.queuePrint(textDataList[i]);
	}
};

// Job class
// Object used to store Job components in a multi-threaded environment.
// @field - dataBuffer: Any JavaScript object that holds all data for a Job.
// @field - intervalRef: Reference to the interval task returned by setInterval.
// @function - start: Any javascript with no arguments that initiates the job.
function Job(initialData) {
	this.dataBuffer = initialData;
	this.intervalRef = null;
	this.start = null;
};

// TextData class
// Object used to store all the Job data for a string printing job.
// @field - output: The string to print.
// @filed - container: The jQuery html container to print the string to.
// @field - outputSpeed: An integer representing the number of milliseconds
//		between character prints.
function TextData(stringToPrint, htmlContainer, speedToPrint) {
	this.output = stringToPrint;
	this.container = htmlContainer;
	this.outputSpeed = speedToPrint;
};

// execute function
// Function executes all the queued jobs
VisualUtils.execute = function() {
	running += jobs.length;
	VisualUtils.removeControl();
	var i;
	for(i = 0; i < jobs.length; i++) {
		jobs[i].start();
	}
	jobs = [];
};

// queuePrint function
// Sets up a scrolling print job and pushed to jobs array.
// @param - textData: The TextData object that is being put on the text queue.
VisualUtils.queuePrint = function(textData) {
	var curJob = new Job(textData);
	curJob.start = function() { 
		var jobData = this.dataBuffer;
		if(jobData.output.length > 0) {
			jobData.container.append(jobData.output[0]);
			jobData.output = jobData.output.slice(1);
			this.intervalRef = setInterval(VisualUtils.scrollPrint, jobData.outputSpeed, this);
		}
	};
	jobs.push(curJob);
};

// scrollPrint function
// Prints one character of the string contained in the job dataBuffer
// and clears the task when the string is empty.
// @param - job: The job object that contains the string and intervalRef.
VisualUtils.scrollPrint = function(job) {
	var jobData = job.dataBuffer;
	if(jobData.output.length > 0) {
		jobData.container.append(jobData.output[0]);
		jobData.output = jobData.output.slice(1);	
	}
	else {
		jobData.container.html(jobData.container.text());
		clearInterval(job.intervalRef);
		--running;
		VisualUtils.checkIfDone();
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