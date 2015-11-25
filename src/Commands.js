// Command class
// Base object used to create a console command.
// @field protected - _name: The name of the Command.
// @field protected - _execute: Function that is used to perform the desired functionality for the Command.
function Command(name, execute) {
    this.__name = name;
    this.__execute = execute;
    
    this.getName = function() {
        return this.__name;
    };
};

// execute function
// Performs the specified command.
// @param - rawCommmand: The unformated input command string from the user.
Commands.execute = function(rawCommand) {
    rawCommand = rawCommand.trim().replace(/\s+/g, ' ');
    if(rawCommand === '') {
        VisualUtils.returnControl();
        return;
    }

    var splitCommand = rawCommand.split(' ');
    var command = splitCommand.shift();
    var args = splitCommand;

    Commands.routeCommand(command, args);
};

// routeCommand function
// Determines what command is being executed and performs the corresponding
// @param - command: The command being executed.
// @param - args: The arguments passed to the command.
Commands.routeCommand = function(command, args) {
    switch(command) {
        case 'help':
            Commands.help();
            return;
        default:
            Commands.commandError(command);
    }
};

// help function
// Displays the list of non private commands.
Commands.help = function() {
    var textDatas = [];
    var tempOutDiv = $('#output');
    for(var i = 0; i < system.commands.length; i++) {
        var tempString = system.commands[i];
        var tempDiv = $('<div></div>');
        tempOutDiv.append(tempDiv);
        var nextTextData = new TextData(tempString, tempDiv, 20);
        textDatas.push(nextTextData);
    }
    VisualUtils.queuePrint(textDatas);
    VisualUtils.execute();
};

// commandError function
// Notifies user that the specified command is not recognized on the current system.
// @param - command: The command string that is unrecognisable
Commands.commandError = function(command) {
    var textDatas = [];
    var errorString = command + ' is not a recognized command on this system.';
    var newDiv = $('<div/>');
    $('#output').append(newDiv);
    textDatas.push(new TextData(errorString, newDiv, 20));
    VisualUtils.queuePrint(textDatas);
    VisualUtils.execute();
};
