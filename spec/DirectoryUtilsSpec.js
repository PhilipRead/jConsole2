describe('Directory', function(){
    describe('getName', function(){
        it('returns the Directory name', function(){
            var testName = 'Test Name';
            var testDirectory = new Directory;
            
            testDirectory._name = testName;
            
            expect(testDirectory.getName()).toBe(testName);
        });
    });
    
    describe('_removeFromParent', function(){
        it('removes the Directory from this parent', function(){
            var testName = 'Test Name';
            var testChildren = [];
            testChildren[testName] = testName;
            var testParent = {
                _children: testChildren
            };
            var testThis = {
                _parent: testParent,
                _name: testName
            };
            var testDirectory = new Directory();
            testDirectory._removeFromParent = testDirectory._removeFromParent.bind(testThis);
            
            testDirectory._removeFromParent();
            
            expect(testChildren[testName]).toBe(null);
        });
    });
});


describe('Folder', function(){
    describe('constructor', function(){
        it('initializes the Folder name properly', function(){
            var testName = 'testName';
            var testFolder = new Folder(testName);
            
            expect(testFolder._name).toBe(testName);
        });
    });
    
    describe('__setName', function(){
        var testFolder;
        var testName;
        var testCaller;
        
        describe('is called with a null name', function(){
            it('throws the error "Folder name must not be empty."', function(){
                testName = null;
                testFolder = new Folder();
                testCaller = function(){
                    testFolder.__setName(testName);
                };
                
                expect(testCaller).toThrow('Folder name must not be empty.');
            });
        });
        
        describe('is called with an empty string', function(){
            it('throws the error "Folder name must not be empty."', function(){
                testName = '';
                testFolder = new Folder();
                testCaller = function(){
                    testFolder.__setName(testName);
                };
                
                expect(testCaller).toThrow('Folder name must not be empty.');
            });
        })
        
        describe('is called with a non-empty string', function(){
            it('assigns the name properly', function(){
                testName = 'testName';
                testFolder = new Folder();
                
                testFolder.__setName(testName);
                
                expect(testFolder._name).toBe(testName);
            });
        });
    });
    
    describe('getPath', function(){
        it('returns the path of the Folder', function(){
            var testParentPath = "Test Parent Path";
            var parentPathSpy = jasmine.createSpy('getPath').and.returnValue(testParentPath);
            var testParent = {
                getPath: parentPathSpy
            };
            var testName = "Test Name";
            var testThis = {
                _parent: testParent,
                _name: testName
            };
            var fullTestPath = testParentPath + testName + '/';
            var testFolder = new Folder();
            testFolder.getPath = testFolder.getPath.bind(testThis);
            
            expect(testFolder.getPath()).toBe(fullTestPath);
        });
    });
    
    describe('getChildren', function(){
        it('returns the children of the Folder', function(){
            var testFolder = new Folder();
            var testChildren = [];
            for(var i=0; i<3; i++){
                var curTestChild = new Folder('Test Child' + i);
                testChildren.push(curTestChild);
                testFolder.addChild(curTestChild);
            }
            
            var testResult = testFolder.getChildren();
            var bothSame = $(testResult).not(testChildren).length === 0 && $(testChildren).not(testResult).length === 0;
            
            expect(bothSame).toBe(true);
        });
    });
    
    describe('sortedChildNames', function(){
        describe('is called with a Folder child', function(){
            it('formats the Folder name correctly', function(){
                var testFolder = new Folder();
                var testName = "testName";
                var formattedName = testName + '/';
                testFolder.addChild(new Folder(testName));
                
                var testResult = testFolder.sortedChildNames();
                
                expect(testResult[0]).toEqual(formattedName);
            });
        });
        
        describe('is called with File child', function(){
            it('formats the File name correctly', function(){
                var testFolder = new Folder();
                var testName = "testName.txt";
                testFolder.addChild(new File(testName, null));
                
                var testResult = testFolder.sortedChildNames();
                
                expect(testResult[0]).toEqual(testName);
            });
        });
        
        describe('is called with Folder and File children', function(){
            it('formats and orders the names correctly', function(){
                var testFolder = new Folder();
                testFolder.addChild(new Folder('123'));
                testFolder.addChild(new Folder('Fol'));
                testFolder.addChild(new Folder('fol'));
                testFolder.addChild(new File('987', null));
                testFolder.addChild(new File('File', null));
                testFolder.addChild(new File('file', null));
                var expectedResult = ['123/', '987', 'File', 'Fol/', 'file', 'fol/'];
                
                var testResult = testFolder.sortedChildNames();
                
                expect(testResult).toEqual(expectedResult);
            });
        });
    });
    
    describe('addChild', function(){
        describe('is called when the Folder already contains a child Directory with same name', function(){
            it('throws a context specific error', function(){
                var testFolderName = "TestFolder";
                var testFolder = new Folder(testFolderName);
                var testOrigChildName = 'TestOrigChildName';
                var testOrigChild = {
                    _name: testOrigChildName
                }
                testFolder._children[testOrigChild._name] = testOrigChild;
                var testNewChildName = testOrigChildName;
                var testNewChild = {
                    _name: testNewChildName
                }
                var testCaller = function() {
                    testFolder.addChild(testNewChild);
                }
                var testErrorMessage = testFolderName + ' already contains a directory named ' + testNewChildName;
                
                expect(testCaller).toThrow(testErrorMessage);
            });
        });
        
        describe('is called when the Folder does not contain a child Directory with that name', function(){
            var testNewChild;
            var testChildName;
            var testOrigChild;
            var testChildParent;
            var testThis;
            var testChildren;
            var testFolder;
            var returnValue;
            
            
            beforeAll(function(){
                testChildParent = { name: 'testChildParent' };
                testChildName = 'TestChildName';
                testNewChild = {
                    _parent: testChildParent,
                    _name: testChildName
                };
                testChildren = [];
                testOrigChild = { name: 'testOrigChild' };
                testChildren[testChildName] = null;
                testThis = {
                    _children: testChildren
                };
                testFolder = new Folder();
                testFolder.addChild = testFolder.addChild.bind(testThis);
                
                returnValue = testFolder.addChild(testNewChild);
            });
            
            it("saves the child Directory to the Folder's list of children", function(){
                expect(testThis._children[testChildName]).toBe(testNewChild);
            });
            
            it("sets the child Directory's parent to the Folder", function(){
                expect(testNewChild._parent).toBe(testThis);
            });
        });
    });
    
    describe('remove', function(){
        var testThis;
        var testFolder;
        
        beforeAll(function(){
            testThis = jasmine.createSpyObj('testThis', ['_removeChildren', '_removeFromParent']);
            testFolder = new Folder();
            testFolder.remove = testFolder.remove.bind(testThis);
            
            testFolder.remove();
        });
        
        it('removes all the children', function(){
            expect(testThis._removeChildren).toHaveBeenCalled();
        });
        
        it('removes Folder from the parent Folder', function(){
            expect(testThis._removeFromParent).toHaveBeenCalled();
        });
    });
    
    describe('_removeChildren', function(){
        var numChildren;
        var testChildren;
        var testThis;
        var testFolder;
        
        beforeAll(function(){
            numChildren = 10;
            testChildren = [];
            for(var i=0; i<numChildren; i++) {
                var testChildName = 'testChild' + i;
                testChildren[testChildName] = jasmine.createSpyObj(testChildName, ['remove']);
            }
            testThis = {
                _children: testChildren
            };
            testFolder = new Folder();
            testFolder._removeChildren = testFolder._removeChildren.bind(testThis);
            
            spyOn(Object, 'keys').and.callThrough();
            
            testFolder._removeChildren();
        });
        
        it('gets the child Directory keys', function(){
            expect(Object.keys).toHaveBeenCalledWith(testChildren);
        });
        
        it('removes all child Directories', function(){
            for(var i=0; i<numChildren; i++) {
                var testChildName = 'testChild' + i;
                expect(testChildren[testChildName].remove).toHaveBeenCalled();
            }
        });
    });
});

describe('Root', function(){
    describe('getPath', function(){
        it('returns the path of the Root', function(){
            var testRoot = new Root();
            
            expect(testRoot.getPath()).toBe('/');
        });
    });
    
    describe('remove', function(){
        it('removes all the children', function(){
            var testThis = jasmine.createSpyObj('testThis', ['_removeChildren']);
            var testRoot = new Root();
            testRoot.remove = testRoot.remove.bind(testThis);
            
            testRoot.remove();
            
            expect(testThis._removeChildren).toHaveBeenCalled();
        });
    });
});

describe('File', function(){
    describe('constructor', function(){
        var testName;
        var testExtension;
        var testFullName;
        var testFile;
        
        beforeAll(function(){
            testName = 'TestName';
            testExtension = 'TestExtension';
            testFullName = testName + '.' + testExtension;
            testFile = new File(testFullName, null);
        });
        
        it('sets the full name', function(){
            expect(testFile._name).toBe(testFullName);
        });
        
        it('sets the correct extension', function(){
            expect(testFile.__extension).toBe(testExtension);
        });
    });
    
    describe('__setName', function(){
        var testName;
        var testExtension;
        var testFullName;
        var testFile;
        var testCaller;
        
        describe('is called with an empty full name', function(){
            it('throws the error "File name must not be empty"', function(){
                testFullName = '';
                testFile = new File();
                testCaller = function(){
                    testFile.__setName(testFullName);
                };
                
                expect(testCaller).toThrow('File name must not be empty.');
            });
        });
        
        describe('is called with only an extension', function(){
            it('throws the error "File name cannot be just an extension."', function(){
                testFullName = '.TestExtension';
                testFile = new File();
                testCaller = function(){
                    testFile.__setName(testFullName);
                };
                
                expect(testCaller).toThrow('File name cannot be just an extension.');
            });
        });
        
        describe('is called with a name but not an extension', function(){
            describe('the name ends with a period', function(){
                beforeAll(function(){
                    testName = 'TestName.';
                    testExtension = '';
                    testFullName = testName + testExtension;
                    testFile = new File();
                    
                    testFile.__setName(testFullName);
                });
                
                it('assigns the extension to null', function(){
                    expect(testFile.__extension).toBe(null);
                });
                
                it('assigns the full name', function(){
                    expect(testFile._name).toBe(testFullName);
                });
            });
            
            describe('the name does not end with a period', function(){
                beforeAll(function(){
                    testName = 'TestName';
                    testExtension = '';
                    testFullName = testName + testExtension;
                    testFile = new File();
                    
                    testFile.__setName(testFullName);
                });
                
                it('assigns the extension to null', function(){
                    expect(testFile.__extension).toBe(null);
                });
                
                it('assigns the full name', function(){
                    expect(testFile._name).toBe(testFullName);
                });
            });

        });
        
        describe('is called with a name and an extension', function(){
            beforeAll(function(){
                testName = 'TestName';
                testExtension = 'TestExtension';
                testFullName = testName + '.' + testExtension;
                testFile = new File();
                
                testFile.__setName(testFullName);
            });
            
            it('assigns the extension to null', function(){
                expect(testFile.__extension).toBe(testExtension);
            });
            
            it('assigns the full name', function(){
                expect(testFile._name).toBe(testFullName);
            });
        });
    });
    
    describe('getPath', function(){
        it('returns the path of the File', function(){
            var testParentPath = "Test Parent Path";
            var parentPathSpy = jasmine.createSpy('getPath').and.returnValue(testParentPath);
            var testParent = {
                getPath: parentPathSpy
            };
            var testName = "Test Name";
            var testThis = {
                _parent: testParent,
                _name: testName
            };
            var fullTestPath = testParentPath + testName;
            var testFile = new File();
            testFile.getPath = testFile.getPath.bind(testThis);
            
            expect(testFile.getPath()).toBe(fullTestPath);
        });
    });
    
    describe('remove', function(){
        it('removes the file from the parent Folder', function(){
            var testThis = jasmine.createSpyObj('testThis', ['_removeFromParent']);
            var testFile = new File();
            testFile.remove = testFile.remove.bind(testThis);
            
            testFile.remove();
            
            expect(testThis._removeFromParent).toHaveBeenCalled();
        });
    });
});