describe('VisualUtils.clearInput', function(){
    var inputDiv;
    
    it('clears the input container text', function(){
        inputDiv = $('#input');
        inputDiv.html('test input text');
        
        VisualUtils.clearInput();
        
        expect(inputDiv.text()).toBe('');
    });
});

describe('VisualUtils.outputNewLines', function(){
    var testDiv;
    var testNumLines;
    
    describe('is called with 0 lines', function(){
        it('does not add any children to the specified container', function(){
            testDiv = $('<div/>');
            testNumLines = 0;
            
            VisualUtils.outputNewLines(testNumLines, testDiv);
            
            expect(testDiv.children().length).toBe(0);
        });
    });
    
    describe('is called with more than 0 lines', function(){
        it('outputs the correct number of lines to the specified container', function(){
            testDiv = $('<div/>');
            testNumLines = 10;
            
            VisualUtils.outputNewLines(testNumLines, testDiv);
            
            expect(testDiv.children().length).toBe(testNumLines);
        }); 
    });
});

describe('VisualUtils.flashOutput', function(){
    it('appends a new container to the specified container with the specified string', function(){
        var testDiv = $('<div/>');
        var testString = 'test string';
        
        VisualUtils.flashOutput(testString, testDiv);
        
        var firstChild = testDiv.children()[0];
        expect(firstChild.textContent).toBe(testString);
    }); 
});

describe('SerialPrintJob', function(){
    describe('__callback', function(){
        var testSerialJob;
        var testJob;
        var testTextDatas;
        
        describe('is called with a job that has no more strings to print', function(){
            var beforeRunning;
            beforeAll(function(){
                beforeRunning = system.running;
                testTextDatas = [];
                testJob = { _textDatas: testTextDatas };
                
                spyOn(VisualUtils, 'checkIfDone');
                
                testSerialJob = new SerialPrintJob(null);
                system.running++;
                testSerialJob.__callback(testJob);
            });
            
            it('decrements the running counter by one', function(){
                expect(system.running).toBe(beforeRunning);
            });
            
            it('checks if all jobs are done', function(){
                expect(VisualUtils.checkIfDone).toHaveBeenCalled();
            });
        });
        
        describe('is called with a job that has strings to print', function(){
            var firstTextData;
            beforeAll(function(){
                firstTextData = 'testTextData1';
                testTextDatas = [firstTextData, 'testTextData2', 'testTextData3'];
                testJob = { _textDatas: testTextDatas };
                
                spyOn(VisualUtils, 'scrollPrint');
                
                testSerialJob = new SerialPrintJob(null);
                testSerialJob.__callback(testJob);
            });
            
            it('begins the next print job', function(){
                expect(VisualUtils.scrollPrint).toHaveBeenCalledWith(firstTextData, testJob);
            });
        });
    });
    
    describe('start', function(){
        it('starts the job thread', function(){
            var testCallback = jasmine.createSpy('__callback');
            var testThis = { __callback: testCallback };
            var testJob = new SerialPrintJob(null);
            testJob.start = testJob.start.bind(testThis);
    
            spyOn(window, 'setTimeout');
            
            testJob.start();
            
            expect(window.setTimeout).toHaveBeenCalledWith(testCallback, 1, testThis);
        });
    });
});

describe('VisualUtils.execute', function(){
    var testJobs;
    var testJob1;
    var testJob2;
    var testJob3;
    var testStarts;
    
    beforeAll(function(){
        testJobs = [testJob1, testJob2, testJob3];
        testStarts = [];
        for(var i=0; i<testJobs.length; i++){
            testStarts.push(jasmine.createSpy('start'));
            testJobs[i] = { start: testStarts[i] };
        }
        
        system.jobs = testJobs;
        
        spyOn(VisualUtils, 'removeControl');
        
        VisualUtils.execute();
    });
    
    it('sets the global running to the number of jobs', function(){
        expect(system.running).toBe(testJobs.length);
    });
    
    it('removes control from the user', function(){
        expect(VisualUtils.removeControl).toHaveBeenCalled();
    });
    
    it('starts all the jobs in the queue', function(){
        for(var i=0; i<testStarts.length; i++){
            expect(testStarts[i]).toHaveBeenCalled();
        }
    });
    
    it('sets the jobs list to empty', function(){
        expect(system.jobs).toEqual([]);
    });
});

describe('VisualUtils.queuePrint', function(){
    var testTextDatas;
    var origJobsLen;
    
    describe('is called with a null arg', function(){
        it('does not queue up a new job', function(){
            origJobsLen = system.jobs.length;
            VisualUtils.queuePrint(null);
            
            expect(system.jobs.length).toBe(origJobsLen);
        });
    });
    
    describe('is called with a list of TextDatas', function(){
        beforeAll(function(){
            testTextDatas = ['testTextData1', 'testTextData2', 'testTextData3'];
            origJobsLen = system.jobs.length;
            
            spyOn(window, 'SerialPrintJob');
            
            VisualUtils.queuePrint(testTextDatas);
        });
        
        afterAll(function(){
            system.jobs = [];
        });
        
        it('creates a new SerialPrintJob', function(){
            expect(window.SerialPrintJob).toHaveBeenCalledWith(testTextDatas);
        });
        
        it('adds a new job to the jobs list', function(){
            expect(system.jobs.length).toBe(origJobsLen + 1);
        });
    });
});

describe('VisualUtils.scrollPrint', function(){
    var testTextData;
    var testPrintManager;
    var testContainer;
    var outText;
    var remText;
    
    describe('is called with empty text data output', function(){
        var testTextFun;
        var testHtmlFun;
        var testContinueFun;

        
        beforeAll(function(){
            remText = '';
            outText = 'testOutText';
            testTextFun = jasmine.createSpy('text').and.returnValue(outText);
            testHtmlFun = jasmine.createSpy('html');
            testContainer = { 
                text: testTextFun,
                html: testHtmlFun
            };
            testTextData = { 
                container: testContainer,
                output: remText
            };
            
            testContinueFun = jasmine.createSpy('continue');
            testPrintManager = { continue: testContinueFun };
            
            VisualUtils.scrollPrint(testTextData, testPrintManager);
        });
        
        it('formats the inner text to be on one line in the html', function(){
            expect(testTextFun).toHaveBeenCalled();
            expect(testHtmlFun).toHaveBeenCalledWith(outText);
        });
        
        it('executes the Print Manager callback', function(){
            expect(testContinueFun).toHaveBeenCalled();
        });
    });
    
    describe('is called with non-empty text data', function(){
        var testAppendFun;
        var testGetFun;
        var testScrollFun;
        var getObj;
        var testOutspeed;
        var testFirstLetter;
        
        beforeAll(function(){
            testAppendFun = jasmine.createSpy('append');
            outText = 'testOutput';
            testFirstLetter = 't';
            remText = 'estOutput';
            testScrollFun = jasmine.createSpy('scrollIntoView');
            getObj = {
                scrollIntoView: testScrollFun
            }
            testGetFun = jasmine.createSpy('get').and.returnValue(getObj);
            testContainer = {
                append: testAppendFun,
                get: testGetFun
            };
            testOutSpeed = 10;
            testTextData = {
                container: testContainer,
                output: outText,
                outputSpeed: testOutSpeed
            };
            testPrintManager = null;
            
            spyOn(window, 'setTimeout');
            
            VisualUtils.scrollPrint(testTextData, testPrintManager);
        });
        
        it('appends the next character to the text data container', function(){
            expect(testAppendFun).toHaveBeenCalledWith(testFirstLetter);
        });
        
        it('scrolls the console to be visisble to the user', function(){
            expect(testGetFun).toHaveBeenCalledWith(0);
            expect(testScrollFun).toHaveBeenCalled();
        });
        
        it('sets the text data output with the original string without the first letter', function(){
            expect(testTextData.output).toBe(remText);
        });
        
        it('schedules the next character print', function(){
            expect(window.setTimeout).toHaveBeenCalledWith(VisualUtils.scrollPrint, testOutSpeed, testTextData, testPrintManager);
        });
    });
});

describe('VisualUtils.checkIfDone', function(){
    describe('is called when jobs are still running', function(){
        it('does not return control to the user', function(){
            system.running = 1;
            spyOn(VisualUtils, 'returnControl');
            
            VisualUtils.checkIfDone();
            
            expect(VisualUtils.returnControl).not.toHaveBeenCalled();
            
            system.running = 0;
        });
    });
    
    describe('is called when no jobs are running', function(){
        it('returns control to the user', function(){
            system.running = 0;
            spyOn(VisualUtils, 'returnControl');
            
            VisualUtils.checkIfDone();
            
            expect(VisualUtils.returnControl).toHaveBeenCalled();
            
            system.running = 0;
        });
    });
});

describe('VisualUtils.removeControl', function(){
    var inputTag;
    var promptTag;
    var jQueryTest;
    
    beforeAll(function(){
        inputTag = '#input';
        promptTag = '#prompt';
        
        jQueryTest = jasmine.createSpyObj('jQueryTest', ['attr', 'off', 'html']);
        spyOn(window, '$').and.returnValue(jQueryTest);
        
        VisualUtils.removeControl();
    });
    
    it('removes the ability to type', function(){
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(jQueryTest.attr).toHaveBeenCalledWith('contenteditable', 'false');
    });
    
    it('removes the command line key down events', function(){
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(jQueryTest.off).toHaveBeenCalledWith('keydown', KeyUtils.inputKeyDownHandler);
    });
    
    it('empties the command line', function(){
        expect(window.$).toHaveBeenCalledWith(promptTag);
        expect(jQueryTest.html).toHaveBeenCalledWith('');
    });
});

describe('VisualUtils.returnControl', function(){
    var inputTag;
    var promptTag;
    var outputTag;
    var jQueryTest;
    var testGet;
    var testGetFun;
    
    beforeAll(function(){
        inputTag = '#input';
        promptTag = '#prompt';
        outputTag = '#output';
        
        jQueryTest = jasmine.createSpyObj('jQueryTest', ['html', 'attr', 'focus', 'on']);
        testGet = jasmine.createSpyObj('testGet', ['scrollIntoView']);
        testGetFun = jasmine.createSpy('get').and.returnValue(testGet);
        jQueryTest.get = testGetFun;
        
        spyOn(window, '$').and.returnValue(jQueryTest);
        spyOn(VisualUtils, 'outputNewLines');
        
        VisualUtils.returnControl();
    });
    
    it('appends a blank line to the window ouput', function(){
        expect(VisualUtils.outputNewLines).toHaveBeenCalledWith(1, jQueryTest);
        expect(window.$).toHaveBeenCalledWith(outputTag);
    });
    
    it('puts back the prompt arrow', function(){
        expect(window.$).toHaveBeenCalledWith(promptTag);
        expect(jQueryTest.html).toHaveBeenCalledWith('>&nbsp');
    });
    
    it('returns the ability to type back to the user', function(){
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(jQueryTest.attr).toHaveBeenCalledWith('contenteditable', 'plaintext-only');
    });
    
    it('places the caret focus on the commmand line', function(){
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(jQueryTest.focus).toHaveBeenCalled();
    });
    
    it('enables all key events', function(){
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(jQueryTest.on).toHaveBeenCalledWith('keydown', KeyUtils.inputKeyDownHandler);
    });
    
    it('scrolls window to the command line', function(){
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(testGetFun).toHaveBeenCalledWith(0);
        expect(testGet.scrollIntoView).toHaveBeenCalled();
    });
});

describe('VisualUtils.curDirPrompt', function(){
    var testCurDir;
    var testPath;
    var expectedPrompt;
    var getPathSpy;
    var origCurDir;
    var jQueryTest;
    var promptTag;
    var HTML_Spy;
    
    beforeAll(function(){
        testPath = '/testPath/';
        expectedPrompt = testPath + '>&nbsp';
        testCurDir = {};
        jQueryTest = {};
        promptTag = '#prompt';
        
        getPathSpy = jasmine.createSpy('getPath').and.returnValue(testPath);
        testCurDir.getPath = getPathSpy;
        origCurDir = system.curFolder;
        system.curFolder = testCurDir;
        HTML_Spy = jasmine.createSpy('html');
        jQueryTest.html = HTML_Spy;
        spyOn(window, '$').and.returnValue(jQueryTest);
        
        VisualUtils.curDirPrompt();
    });
    
    it("gets the current directory's full path", function(){
        expect(getPathSpy).toHaveBeenCalled();
    });
    
    it('updates the prompt text correctly', function(){
        expect(window.$).toHaveBeenCalledWith(promptTag);
        expect(HTML_Spy).toHaveBeenCalledWith(expectedPrompt);
    });
    
    afterAll(function(){
        system.curFolder = origCurDir;
    });
});
