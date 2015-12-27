// System singelton class
// Object used to represent the console's computer system.
// @field public - root: The Root folder object for this system.
// @field public - jobs: The list print jobs that are queued.
// @field public - running: The number of jobs that are currently executing.
// @field pulbic - commands: The list of commands on this system.
function System() {
    this.root = new Root();
    this.curFolder = this.root;
    this.jobs = [];
    this.running = 0;
    this.commands = [
        'help'
    ];
    
    // saveSystem function
    // Function that saves the current state of the System instance.
    // NOTE: Not all fields are saved! Static or volatile fields are ignored.
    this.saveSystem = function() {
        var dirTreeJSON = {
            "children": Setup.saveDirTree(this.root.getChildren())
        };
        
        var systemJSON = {
            "dirTreeJSON": dirTreeJSON
        };
        
        var systemStr = JSON.stringify(systemJSON);
        
        localStorage.setItem('jConsoleSystem', systemStr);
    };
    
    // loadSystem function
    // Function that loads the saved state of th System instance.
    this.loadSystem = function() {
        var systemStr = localStorage.getItem('jConsoleSystem');
        
        var systemJSON = JSON.parse(systemStr);
        var dirTreeJSON = systemJSON.dirTreeJSON;
        
        this.root = Setup.initDirTree(this.root, dirTreeJSON.children);
    }
};
