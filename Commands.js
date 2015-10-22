// execute function
// Performs the specified command.
// @param - rawCommmand: The unformated input command string from the user.
Commands.execute = function(rawCommand) {
	var commandInput = rawCommand.trim().replace(/\s+/g, ' ');
	if(commandInput == '') {
		VisualUtils.returnControl();
		return;
	}
	
	var splitCommand = commandInput.split(' ');
	var command = splitCommand[0];
	
	switch(command) {
		default:
			var printJobs = [];
			var errorString = command + ' is not a recognized command on this system.';
			var newDiv = $('<div></div>');
			$('#output').append(newDiv);
			printJobs.push(new TextData(errorString, newDiv, 20));
			VisualUtils.printOutput(printJobs);
			VisualUtils.execute();
	}
};