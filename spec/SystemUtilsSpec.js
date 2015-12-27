describe('System', function() {
    describe('constructor', function() {
        var testSystem;
        
        beforeAll(function() {
            spyOn(window, 'Root');
            testSystem = new System();
        });
        
        it('creates a new root and initializes it', function(){
            expect(window.Root).toHaveBeenCalled();
            expect(testSystem.root).toEqual(jasmine.any(Root));
        });
        
        it('sets the current folder to the intialized root', function(){
            expect(testSystem.curFolder).toEqual(testSystem.root);
        });
        
        it('initializes an empty list of jobs', function(){
            expect(testSystem.jobs).toEqual([]);
        });
        
        it('initializes running job count to 0', function(){
            expect(testSystem.running).toBe(0);
        });
        
        it('initializes the set of commands', function(){
            expect(testSystem.commands).toEqual([
                'help'
            ]);
        });
    });
    
    describe('saveSystem', function(){
        var testThis;
        var testRoot;
        var expecSystemJSON;
        var expecSystemStr;
        
        beforeAll(function(){
            testRoot = jasmine.createSpyObj('testRoot', ['getChildren']);
            testRoot.getChildren.and.returnValue([]);
            testThis = {
                root: testRoot
            };
            system.saveSystem = system.saveSystem.bind(testThis);
            expecSystemJSON = {
                "dirTreeJSON":{
                    "children":[]
                }
            };
            expecSystemStr = JSON.stringify(expecSystemJSON);
            
            spyOn(Setup, 'saveDirTree').and.callThrough();
            spyOn(JSON, 'stringify').and.callThrough();
            spyOn(localStorage, 'setItem');
            
            system.saveSystem();
        });

        it('converts the directory tree to a JSON object', function(){
            expect(testRoot.getChildren).toHaveBeenCalled();
            expect(Setup.saveDirTree).toHaveBeenCalled();
        });
        
        it('converts the system JSON object to a string', function(){
            expect(JSON.stringify).toHaveBeenCalledWith(expecSystemJSON);
        });
        
        it('saves the string to local storage', function(){
            expect(localStorage.setItem).toHaveBeenCalledWith('jConsoleSystem', expecSystemStr);
        });
    });
    
    describe('loadSystem', function(){
        var initialSystem;
        var expecSystemJSON;
        var expecSystemStr;
        
        beforeAll(function(){
            initialSystem = localStorage.getItem('jConsoleSystem');
            expecSystemJSON = {
                "dirTreeJSON":{
                    "children":[]
                }
            };
            expecSystemStr = JSON.stringify(expecSystemJSON);
            localStorage.setItem('jConsoleSystem', expecSystemStr);
            
            spyOn(JSON, 'parse').and.callThrough();
            spyOn(localStorage, 'getItem').and.callThrough();
            spyOn(Setup, 'initDirTree').and.callThrough();
            
            system.loadSystem();
        });
        
        it('retrieves the JSON string from local storage', function(){
            expect(localStorage.getItem).toHaveBeenCalledWith('jConsoleSystem');
        });
        
        it('converts the JSON string to a JSON object', function(){
            expect(JSON.parse).toHaveBeenCalledWith(expecSystemStr);
        });
        
        it('converts the JSON directory tree object to the system directory tree object', function(){
            expect(Setup.initDirTree).toHaveBeenCalled();
            expect(system.root.getChildren()).toEqual([]);
        });
        
        afterAll(function(){
           localStorage.setItem('jConsoleSystem', initialSystem); 
        });
    });
});