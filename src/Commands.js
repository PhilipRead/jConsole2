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
        case 'ls':
            Commands.ls();
            return;
        case 'cd':
            Commands.cd(args);
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
        var nextTextData = new TextData(tempString, tempDiv, 10);
        textDatas.push(nextTextData);
    }
    VisualUtils.queuePrint(textDatas);
    VisualUtils.execute();
};

// commandError function
// Notifies user that the specified command is not recognized on the current system.
// @param - command: The command string that is unrecognizable.
Commands.commandError = function(command) {
    var textDatas = [];
    var errorString = command + ' is not a recognized command on this system.';
    var newDiv = $('<div/>');
    $('#output').append(newDiv);
    textDatas.push(new TextData(errorString, newDiv, 10));
    VisualUtils.queuePrint(textDatas);
    VisualUtils.execute();
};

// ls function
// Prints all direct children directories of the current directory to the screen.
Commands.ls = function() {
    var childNames = system.curFolder.sortedChildNames();
    if(childNames.length > 0) {
        VisualUtils.optimumListPrinter(childNames);
    }
    else {
        VisualUtils.returnControl();
    }
};

// cd function
// Changes the current Folder to the specified Folder path.
// If the specified Folder does not exist then an error will be printed to the screen.
// @param paths - The list of paths entered by the user.
//                Only the first path will be used--all others will be ignored.
Commands.cd = function(paths) {
    if(paths.length === 0) {
        var textDatas = [];
        var errorString = 'You must specify a folder path to move to.';
        var newDiv = $('<div/>');
        $('#output').append(newDiv);
        textDatas.push(new TextData(errorString, newDiv, 10));
        VisualUtils.queuePrint(textDatas);
        VisualUtils.execute();
        return;
    }
    
    var newFolder;
    try {
        newFolder = Commands.parseDirStr(paths[0]);
    }
    catch(errorMessage) {
        var textDatas = [];
        var newDiv = $('<div/>');
        $('#output').append(newDiv);
        textDatas.push(new TextData(errorMessage, newDiv, 10));
        VisualUtils.queuePrint(textDatas);
        VisualUtils.execute();
        return;
    }
    
    system.curFolder = newFolder;
};

// parseDirStr function
// Finds the Directory from the specified directory string.
// @param - dirStr: The directory string being parsed that represents the full or indirect path from the current Folder.
// @return The specified Directory if it exists, else null if called with a null or empty string.
// @throws Error if the Directory does not exist and a message showing what does not exist.
Commands.parseDirStr = function(dirStr) {
    if(!dirStr || dirStr === '') return null;
    
    var nextParent;
    var nextChild;
    if(dirStr[0] === '/') {
        nextParent = system.root;
        nextChild = system.root;
    }
    else {
        nextParent = system.curFolder;
        nextChild = null;
    }
    
    var splitDirStr = dirStr.split('/');
    for(var i = 0; i < splitDirStr.length; i++) {
        var nextName = splitDirStr[i];
        if(nextName === '') continue;
        
        nextChild = nextParent.getChild(nextName);
        
        if(nextChild === null) {
            var pathError = splitDirStr.slice(0, i+1).join('/');
            var errorMessage = pathError + ' does not exist';
            throw errorMessage;
        }
        
        nextParent = nextChild;
    }
    
    return nextChild;
};
