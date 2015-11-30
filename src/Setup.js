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
// @return - The passed in Folder object with children added.
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

// saveDirTree function
// Function that converts the Directory tree into a JSON object for saving.
// @param - children: The children of the Root folder.
// @return - A JSON object that represents the current Directory tree as an array of children.
Setup.saveDirTree = function(children) {
    var JSON_Children = [];
    
    for(var i=0; i<children.length; i++) {
        var curChild = children[i];
        var JSON_Child = {};
        
        if(curChild instanceof Folder) {
            JSON_Child.type = 'Folder';
            JSON_Child.children = Setup.saveDirTree(curChild.getChildren());
        }
        else if(curChild instanceof File) {
            JSON_Child.type = 'File';
            JSON_Child.data = curChild.data;
        }
        else {
            throw "Child type is not a known type."
        }
        
        JSON_Child.name = curChild.getName();
        
        JSON_Children.push(JSON_Child);
    }
    
    return JSON_Children;
};

$(document).ready(function() {
    Setup.startUp();
});
