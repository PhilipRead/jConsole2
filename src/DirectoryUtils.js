// Directory class
// Base object used to represent a system directory.
// @field protected - _name: The name of the Directory.
// @field protected - _parent: The parent Directory of this Directory.
function Directory() {
    this._name = null;
    this._parent = null;
    
    // getName public function
    // Gets the Directory's name.
    // @return - The name of the Directory as a string.
    this.getName = function() {
        return this._name;
    };
    
    // _removeFromParent protected function
    // Removes the Directory from the parent Directory.
    this._removeFromParent = function() {
        delete this._parent._children[this._name];
    };
};

// Folder class
// Object used to represent a system folder.
// @field protected - _name: The name of the Folder.
// @field protected - _children: Hash of Directories by name that this Folder will hold.
// @throws - An error if name is empty or null.
function Folder(name) {
    this._name = null;
    this._children = [];
    
    // __setName private function
    // Verifies and sets the name of this folder.
    // @param - name: The name to set this Folder to.
    // @throws - An error if name is empty or null.
    this.__setName = function(name) {
        if(name === undefined) { //For inheritence
            return;
        }
        
        if(!name) {
            throw 'Folder name must not be empty.';
        }

        this._name = name;
    };
    this.__setName(name);
    
    // getPath public function
    // Gets the full path of this Folder.
    // @return - The full path as a string.
    this.getPath = function() {
        return(this._parent.getPath() + this._name + '/');
    };
    
    // getChildren public function
    // Gets the children of the Folder.
    // @return - An array of the children Directories.
    this.getChildren = function() {
        var childArr = [];
        var dirNames = Object.keys(this._children);
        for(var i=0; i<dirNames.length; i++){
            childArr.push(this._children[dirNames[i]]);
        }
        return childArr;
    };
    
    // sortedChildNames public function
    // Builds a sorted list of formatted child names.
    // @returns - A list of the formatted child names.
    this.sortedChildNames = function(){
        var childNames = Object.keys(this._children);
        var objList = [];
        for(var i=0; i<childNames.length; i++){
            objList.push(this._children[childNames[i]]);
        }
        
        objList.sort(function(childA,childB){
            var nameA = childA._name;
            var nameB = childB._name;
            
            if(nameA < nameB) {
                return -1;
            }
            if(nameA > nameB) {
                return 1;
            }
            return 0;
        });
        
        var sortedNames = [];
        for(var i=0; i<objList.length; i++) {
            if(objList[i] instanceof Folder){
                sortedNames.push(objList[i]._name + '/');
            }
            else
            {
                sortedNames.push(objList[i]._name);
            }
        }
        
        return sortedNames;
    };
    
    // addChild public function
    // Adds the specified Directory to this folder.
    // @param - newChild: The Directory to add to this folder.
    // @throws - An error if newChild already exists.
    this.addChild = function(newChild) {
        if(this._children[newChild._name]) {
            throw(this._name + ' already contains a directory named ' + newChild._name);
        }
        this._children[newChild._name] = newChild;
        newChild._parent = this;
    };
    
    // remove public function
    // Removes the Folder from the system.
    this.remove = function() {
        this._removeChildren();
        this._removeFromParent();
    };
    
    // _removeChildren protected function
    // Removes the Folder's children from the system.
    this._removeChildren = function() {
        var childKeys = Object.keys(this._children);
        for(var i=0; i<childKeys.length; i++) {
            this._children[childKeys[i]].remove();
        }
    };
};

Folder.prototype = new Directory();

// Root class
// Object used to represent a root system folder.
// @field protected - name: Always null.
function Root() {
    this._name = null;
    
    // getPath public function
    // Gets the full path of this Root.
    // @return - The full path as a string.
    this.getPath = function() {
        return('/');
    };
    
    // remove public function
    // Removes the Root from the system.
    this.remove = function() {
        this._removeChildren();
    };
};

Root.prototype = new Folder();

// File class
// Object used to represent a file directory.
// @field protected - _name: Name of file with extension.
// @field protected - _parent: Folder that contains this file.
// @field private - __extension: The extension that signifies what type of file this is.
// @field public - data: The machine data for the file.
// @throws - An error if name is empty 
//      or contains just an extension.
function File(name, data) {
    this._name = null;
    this._parent = null;
    this.__extension = null;
    this.data = data;
    
    // __setName private function
    // Verifies and sets the name of this file and extension.
    // @param - fullName: The full name to set this File to.
    // @throws - An error if name is empty
    //      or contains just an extension.
    this.__setName = function(fullName) {
        if(fullName === undefined) { //For inheritence
            return;
        }
        
        if(!fullName) {
            throw 'File name must not be empty.';
        }
        
        var parsedName = fullName.split('.');
        if(parsedName[0] === '') {
            throw 'File name cannot be just an extension.';
        }
        
        var tempExt = parsedName.pop();
        if(parsedName.length === 0 || tempExt === '') {
            this.__extension = null;
        }
        else {
            this.__extension = tempExt;
        }

        this._name = fullName;
    };
    this.__setName(name);
    
    // getPath public function
    // Gets the full path of this File.
    // @return - The full path as a string.
    this.getPath = function() {
        return(this._parent.getPath() + this._name);
    };
    
    // remove public function
    // Removes the File from the system.
    this.remove = function() {
        this._removeFromParent();
    };
};

File.prototype = new Directory();