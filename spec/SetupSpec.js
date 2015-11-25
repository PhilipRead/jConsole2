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