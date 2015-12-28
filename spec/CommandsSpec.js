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
