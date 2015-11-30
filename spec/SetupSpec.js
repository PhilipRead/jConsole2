describe('Setup.startUp', function() {
    var inputTag;
    var jQueryTest;
    
    beforeAll(function() {
        inputTag = '#input';
        jQueryTest = jasmine.createSpyObj('jQueryTest', ['focus', 'on']);
        
        spyOn(window, '$').and.returnValue(jQueryTest);
        spyOn(window, 'System');
        
        Setup.startUp();
    });
    
    it('enables all key events', function() {
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(jQueryTest.on).toHaveBeenCalledWith('keydown', KeyUtils.inputKeyDownHandler);
    });
    
    it('places the caret focus on the commmand line', function() {
        expect(window.$).toHaveBeenCalledWith(inputTag);
        expect(jQueryTest.focus).toHaveBeenCalled();
    });
    
    it('initializes the system object', function() {
        expect(window.System).toHaveBeenCalled();
        expect(system).toEqual(jasmine.any(System));
    });
});

describe('Setup.initDirTree', function(){
    describe('is called with an empty array', function(){
        it('returns the passed Folder unmodified', function(){
            var testFolder = new Folder();
            var testArr = [];
            
            expect(Setup.initDirTree(testFolder, testArr)).toBe(testFolder);
        });
    });
    
    describe('is called with an unknown type in the array', function(){
        it('throws a context specific error', function(){
            var testFolder = new Folder();
            var testRecord = {
                "type":"UnknownType"
            };
            var testArr = [];
            testArr.push(testRecord);
            var testCaller = function(){
                Setup.initDirTree(testFolder, testArr);
            };
            var testErrorMessage = testRecord.type + ' is not a known Directory type.';
            
            expect(testCaller).toThrow(testErrorMessage);
        });
    });
    
    describe('is called with a File type in the array', function(){
        var testFolder;
        var testExtension;
        var testFileName;
        var testFileData;
        var testObj;
        var testArr;
        var returnFol;
        
        beforeAll(function(){
            testFolder = new Folder();
            testExtension = 'test';
            testFileName = 'TestFileName.' + testExtension;
            testFileData = 'TestFileData';
            testObj = {
                "type":"File",
                "name":testFileName,
                "data":testFileData
            };
            testArr = [];
            testArr.push(testObj);
            
            spyOn(window, 'File').and.callThrough();

            returnFol = Setup.initDirTree(testFolder, testArr);
        });
        
        it('creates the new File correctly', function(){
            expect(window.File).toHaveBeenCalledWith(testFileName, testFileData);
        });
        
        it('returns the Folder with the new File as a child', function(){
            expect(returnFol._children[testFileName]._name).toEqual(testFileName);
            expect(returnFol._children[testFileName].__extension).toEqual(testExtension);
            expect(returnFol._children[testFileName].data).toEqual(testFileData);
        });
    });
    
    describe('is called with a Folder type in the array', function(){
        var testFolder;
        var testFolderName;
        var testFolderChildren;
        var testObj;
        var testArr;
        var returnFol;
        
        beforeAll(function(){
            testFolder = new Folder();
            testFolderName = 'TestFolderName';
            testFolderChildren = [];
            for(var i=0; i<3; i++){
                testFolderChildren.push({ 
                    "type":"File",
                    "name":"testChild"+i,
                    "data":"testData"});
            }
            testObj = {
                "type":"Folder",
                "name":testFolderName,
                "children":testFolderChildren
            };
            testArr = [];
            testArr.push(testObj);
            testNewFolder = new Folder(testFolderName);
            
            spyOn(window, 'Folder').and.returnValue(testNewFolder);
            spyOn(Setup, 'initDirTree').and.callThrough();
            
            returnFol = Setup.initDirTree(testFolder, testArr);
        });
        
        it('creates the new Folder correctly', function(){
            expect(window.Folder).toHaveBeenCalledWith(testFolderName);
        });
        
        it("creates the Folder's children", function(){
            expect(Setup.initDirTree).toHaveBeenCalledWith(testNewFolder, testFolderChildren);
        });
        
        it('returns the Folder with the new Folder as a child', function(){
            expect(returnFol._children[testFolderName]._name).toEqual(testFolderName);
        });
    });
});

describe('Setup.saveDirTree', function(){
    describe('is called with no children in the array', function(){
        it('returns the array unchanged', function(){
            var testChildren = [];
            
            expect(Setup.saveDirTree(testChildren)).toEqual(testChildren);
        });
    });
    
    describe('is called with children in the array', function(){
        describe('where one child is of an unknown type', function(){
            it('throws an error complaining about unknown type', function(){
                var testChildren = [];
                var testChild = {};
                testChildren.push(testChild);
                var testCaller = function(){
                    Setup.saveDirTree(testChildren);
                };
                var testMessage = 'Child type is not a known type.';
                
                expect(testCaller).toThrow(testMessage);
            });
        });
        
        describe('that contains a File child type', function(){
            var testChildren = [];
            var testName = 'Test Name';
            var testData = 'Test Data';
            var testChild = new File(testName, testData);
            testChildren.push(testChild);
            
            var testResult = Setup.saveDirTree(testChildren);
            
            it('saves the type to "File"', function(){
                expect(testResult[0].type).toEqual('File');
            });
            
            it('saves the File data', function(){
                expect(testResult[0].data).toEqual(testData);
            });
        });
        
        describe('that contains a Folder child type', function(){
            var testChildren;
            var testName;
            var testGrandChildren;
            var testChild;
            var testResult;
            
            beforeAll(function(){
                testChildren = [];
                testName = 'Test Name';
                testGrandChildren = [];
                testChild = new Folder(testName);
                for(var i=0; i<3; i++){
                    var gChild = new Folder('Test gChild' + i);
                    testGrandChildren.push(gChild);
                    testChild.addChild(gChild);
                }
                testChildren.push(testChild);
                
                spyOn(Setup, 'saveDirTree').and.callThrough();
                
                testResult = Setup.saveDirTree(testChildren);
            });
            
            it('saves the type to "Folder"', function(){
                expect(testResult[0].type).toEqual('Folder');
            });
            
            it('saves the grand children', function(){
                expect(Setup.saveDirTree).toHaveBeenCalledWith(testGrandChildren);
            });
        });
        
        it('saves the Directory names', function(){
            var testChildren = [];
            for(var i=0; i<3; i++){
                var testChild = new Folder('testChild' + i);
                testChildren.push(testChild);
            }
            
            var testResult = Setup.saveDirTree(testChildren);
            
            for(var i=0; i<3; i++){
                expect(testResult[i].name).toEqual('testChild' + i);
            }
        });
    });
});