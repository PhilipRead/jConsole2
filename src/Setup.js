// startUp function
// Function that is run when the document is ready.
Setup.startUp = function() {
    $('#input').on('keydown', KeyUtils.inputKeyDownHandler);
    $('#input').focus();
    system = new System();
};

// initDirTree function
// Function that initializes the Directory tree of the system.
// @param - curFolder: The current Folder object who's children are being built.
// @param - jsonArr: The JSON array that contains the children's information.
// @throws - An error if an unknown type is used.
Setup.initDirTree = function(curFolder, jsonArr) {
    for(var i=0; i<jsonArr.length; i++) {
        var dirInfo = jsonArr[i];
        var nextDir;
        if(dirInfo.type === 'File') {
            nextDir = new File(dirInfo.name, dirInfo.data);
        }
        else if(dirInfo.type === 'Folder') {
            nextDir = Setup.initDirTree(new Folder(dirInfo.name), dirInfo.children);
        }
        else {
            throw(dirInfo.type + ' is not a known Directory type.');
        }
        
        curFolder.addChild(nextDir);
    }
    
    return curFolder;
};

$(document).ready(function() {
    Setup.startUp();
});
