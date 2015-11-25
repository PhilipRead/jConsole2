// Directory class
// Base object used to represent a system directory.
// @field protected - _name: The name of the Directory.
// @field protected - _parent: The parent Directory of this Directory.
function Directory() {
    this._name = null;
    this._parent = null;
    
    // _removeFromParent protected function
    // Removes the Directory from the parent Directory.
    this._removeFromParent = function() {
        this._parent._children[this._name] = null;
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