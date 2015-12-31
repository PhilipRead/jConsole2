describe('Commands.execute', function(){
    var rawCommand;
    var expectedRawCommand;
    var expectedArgs;
    
    describe('is called with an empty string', function(){
        it('returns control to the user', function(){
            rawCommand = '';
            spyOn(VisualUtils, 'returnControl');
            Commands.execute(rawCommand);
            expect(VisualUtils.returnControl).toHaveBeenCalled();
        });
    });
    
    describe('is called with a blank string', function(){
        it('returns control to the user', function(){
            rawCommand = '     ';
            spyOn(VisualUtils, 'returnControl');
            Commands.execute(rawCommand);
            expect(VisualUtils.returnControl).toHaveBeenCalled();
        });
    });
    
    describe('is called with a non-empty and non-blank string', function(){
        describe('with leading whitespace', function(){
            it('passes the command without the leading whitespace', function(){
                rawCommand = '      testCommand';
                expectedRawCommand = 'testCommand';
                expectedArgs = [];
                spyOn(Commands, 'routeCommand');
                Commands.execute(rawCommand);
                expect(Commands.routeCommand).toHaveBeenCalledWith(expectedRawCommand, expectedArgs);
            });
        });
        
        describe('with trailing whitespace', function(){
            it('passes the command without the trailing whitespace', function(){
                rawCommand = 'testCommand          ';
                expectedRawCommand = 'testCommand';
                expectedArgs = [];
                spyOn(Commands, 'routeCommand');
                Commands.execute(rawCommand);
                expect(Commands.routeCommand).toHaveBeenCalledWith(expectedRawCommand, expectedArgs);
            });
        });
        
        describe('with leading and trailing whitespace', function(){
            it('passes the command without the leading and trailing whitespace', function(){
                rawCommand = '      testCommand          ';
                expectedRawCommand = 'testCommand';
                expectedArgs = [];
                spyOn(Commands, 'routeCommand');
                Commands.execute(rawCommand);
                expect(Commands.routeCommand).toHaveBeenCalledWith(expectedRawCommand, expectedArgs);
            }); 
        });
        
        describe('without arguments', function(){
            it('passes the command to the router function with an empty list of args', function(){
                rawCommand = 'testCommand';
                expectedRawCommand = 'testCommand';
                expectedArgs = [];
                spyOn(Commands, 'routeCommand');
                Commands.execute(rawCommand);
                expect(Commands.routeCommand).toHaveBeenCalledWith(expectedRawCommand, expectedArgs);
            });
        });
        
        describe('with one argument', function(){
            describe('with a single space between command and argument', function(){
                it('passes the command to the router function with a list containing the argument', function(){
                    rawCommand = 'testCommand testArg1';
                    expectedRawCommand = 'testCommand';
                    expectedArgs = ['testArg1'];
                    spyOn(Commands, 'routeCommand');
                    Commands.execute(rawCommand);
                    expect(Commands.routeCommand).toHaveBeenCalledWith(expectedRawCommand, expectedArgs);
                });
            });
            
            describe('with multiple spaces between command and argument', function(){
                it('passes the command to the router function with a list containing the argument', function(){
                    rawCommand = 'testCommand       testArg1';
                    expectedRawCommand = 'testCommand';
                    expectedArgs = ['testArg1'];
                    spyOn(Commands, 'routeCommand');
                    Commands.execute(rawCommand);
                    expect(Commands.routeCommand).toHaveBeenCalledWith(expectedRawCommand, expectedArgs);
                });
            });
        });
        
        describe('with multiple arguments', function(){
            it('passes the commmand to the router function with a list containing the arguments', function(){
                rawCommand = 'testCommand testArg1 testArg2 testArg3';
                expectedRawCommand = 'testCommand';
                expectedArgs = ['testArg1', 'testArg2', 'testArg3'];
                spyOn(Commands, 'routeCommand');
                Commands.execute(rawCommand);
                expect(Commands.routeCommand).toHaveBeenCalledWith(expectedRawCommand, expectedArgs);
            });
        });
    });
});

describe('Commands.routeCommand', function(){
    var command;
    var args;
    
    describe('is called with "help" command', function(){
        it('calls the Commands.help function', function(){
            command = 'help';
            args = [];
            
            spyOn(Commands, 'help');
            
            Commands.routeCommand(command, args);
            
            expect(Commands.help).toHaveBeenCalled();
        });
    });
    
    describe('is called with "ls" command', function(){
        it('calls the Commands.ls function', function(){
            command = 'ls';
            args = [];
            
            spyOn(Commands, 'ls');
            
            Commands.routeCommand(command, args);
            
            expect(Commands.ls).toHaveBeenCalled();
        });
    });
    
    describe('is called with a string that is not a listed command', function(){
        it('calls the Commands.commandError function with the command string', function(){
            command = 'not_a_command';
            args = [];
            spyOn(Commands, 'commandError');
            Commands.routeCommand(command, args);
            expect(Commands.commandError).toHaveBeenCalledWith(command);
        });
    });
});

describe('Commands.help', function(){
    Setup.startUp();
    var textDatas = [];
    for(var i = 0; i < system.commands.length; i++) {
        var tempString = system.commands[i];
        var tempDiv = $('<div/>');
        var nextTextData = new TextData(tempString, tempDiv, 10);
        textDatas.push(nextTextData);
    }
    
    beforeAll(function(){
        spyOn(VisualUtils, 'queuePrint');
        spyOn(VisualUtils, 'execute');
        Commands.help();
    });
    
    it('queues up a list of TextData objects that match the list of commands', function(){
        expect(VisualUtils.queuePrint).toHaveBeenCalledWith(textDatas);
    });
    
    it('starts the execution of the print jobs', function(){
        expect(VisualUtils.execute).toHaveBeenCalled();
    });
});

describe('Commands.commandError', function(){
    describe('is called with an arbitrary command string', function(){
        var command = 'testCommand';
        var textDatas = [];
        var errorString = command + ' is not a recognized command on this system.';
        var newDiv = $('<div/>');
        textDatas.push(new TextData(errorString, newDiv, 10));
        
        beforeAll(function(){
            spyOn(VisualUtils, 'queuePrint');
            spyOn(VisualUtils, 'execute');
            Commands.commandError(command);
        });
        
        it('queues up a list containing a single TextData object that match the error message', function(){
            expect(VisualUtils.queuePrint).toHaveBeenCalledWith(textDatas);
        });
        
        it('starts the execution of the print job', function(){
            expect(VisualUtils.execute).toHaveBeenCalled();
        });
    });
});

describe('Commands.ls', function(){
    var origCurFol;
    var testCurFol;
    var testChildren;
    var testChild;
    var getChildrenSpy;
    
    describe('is called when the current folder has children', function(){
        beforeAll(function(){
            origCurFol = system.curFolder;
            testCurFol = {};
            testChildren = ['testChild1', 'testChild2', 'testChild3'];
            
            getChildrenSpy = jasmine.createSpy('sortedChildNames').and.returnValue(testChildren);
            testCurFol.sortedChildNames = getChildrenSpy;
            system.curFolder = testCurFol;
            spyOn(VisualUtils, 'optimumListPrinter');
            
            Commands.ls();
        });
        
        it('gets the list of child directories in alphabetical order', function(){
            expect(getChildrenSpy).toHaveBeenCalled();
        });
        
        it('prints the list of child names', function(){
            expect(VisualUtils.optimumListPrinter).toHaveBeenCalledWith(testChildren);
        });
        
        afterAll(function(){
            system.curFolder = origCurFol;
        });
    });
    
    describe('is called when the current folder has no children', function(){
        beforeAll(function(){
            origCurFol = system.curFolder;
            testCurFol = {};
            testChildren = [];
            
            getChildrenSpy = jasmine.createSpy('sortedChildNames').and.returnValue(testChildren);
            testCurFol.sortedChildNames = getChildrenSpy;
            system.curFolder = testCurFol;
            spyOn(VisualUtils, 'optimumListPrinter');
            spyOn(VisualUtils, 'returnControl');
            
            Commands.ls();
        });
        
        it('gets the list of empty child directories', function(){
            expect(getChildrenSpy).toHaveBeenCalled();
        });
        
        it('does not attempt to print the list of child names', function(){
            expect(VisualUtils.optimumListPrinter).not.toHaveBeenCalledWith(testChildren);
        });
        
        it('returns control to the user', function(){
            expect(VisualUtils.returnControl).toHaveBeenCalled();
        });
        
        afterAll(function(){
            system.curFolder = origCurFol;
        });
    });
});

describe('Commands.parseDirStr', function(){
    var dirStr;
    var returnResult;
    
    describe('is called with no arguments', function(){
        it('returns null', function(){
            returnResult = Commands.parseDirStr();
            
            expect(returnResult).toBe(null);
        });
    });
    
    describe('is called with a null argument', function(){
        it('returns null', function(){
            returnResult = Commands.parseDirStr(null);
            
            expect(returnResult).toBe(null);
        });
    });
    
    describe('is called with an empty string', function(){
        it('returns null', function(){
            dirStr = '';
            
            returnResult = Commands.parseDirStr(dirStr);
            
            expect(returnResult).toBe(null);
        });
    });
    
    describe('is called with a full path string', function(){
        it('begins searching from the root', function(){
            var origRoot = system.root;
            system.root = {};
            dirStr = '/testChild';
            testChild = new Folder('testChild');
            var rootGetChildSpy = jasmine.createSpy('getChild').and.returnValue(testChild);
            system.root.getChild = rootGetChildSpy;
            
            Commands.parseDirStr(dirStr);
            
            expect(rootGetChildSpy).toHaveBeenCalled();
            
            system.root = origRoot;
        });
    });
    
    describe('is called with a relative path string', function(){
        it('begins searching from the current Folder', function(){
            var origCurFol = system.curFolder;
            system.curFolder = {};
            dirStr = 'testChild';
            testChild = new Folder('testChild');
            var curGetChildSpy = jasmine.createSpy('getChild').and.returnValue(testChild);
            system.curFolder.getChild = curGetChildSpy;
            
            Commands.parseDirStr(dirStr);
            
            expect(curGetChildSpy).toHaveBeenCalled();
            
            system.curFolder = origCurFol;
        });
    });
    
    describe('is called with a path that does not exist', function(){
        it('throws an error', function(){
            var origCurFol = system.curFolder;
            system.curFolder = {};
            dirStr = 'testChild';
            var expectedError = dirStr + ' does not exist';
            var curGetChildSpy = jasmine.createSpy('getChild').and.returnValue(null);
            system.curFolder.getChild = curGetChildSpy;
            
            var callWrapper = function() {
                Commands.parseDirStr(dirStr);
            };
            
            expect(callWrapper).toThrow(expectedError);
            
            system.curFolder = origCurFol;
        });
    });
    
    describe('is called with a path that does exist', function(){
        it('returns the specified child Directory', function(){
            var origCurFol = system.curFolder;
            system.curFolder = new Folder('testParent');
            dirStr = 'testChild';
            var expectedResult = new Folder('testChild');
            system.curFolder.addChild(expectedResult);
            
            returnResult = Commands.parseDirStr(dirStr);
            
            expect(returnResult).toBe(expectedResult);
            
            system.curFolder = origCurFol;
        });
    });
});
