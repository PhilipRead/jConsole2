describe('KeyUtils.inputKeyDownHandler', function (){
    var testEvent = {
        keyCode: null,
        preventDefault: null
    };
    var outDiv = $('#output');
    
    describe('is triggered from the user pressing the enter key.', function(){
        var expectedTextContent;
        var expectedEchoTxt;
        
        beforeAll(function(){
            testEvent.keyCode = KeyUtils.keyCode.ENTER;
            testEvent.preventDefault = jasmine.createSpy('preventDefault');
            expectedTextContent = 'testText';
            expectedEchoTxt = '> ' + expectedTextContent;
            var thisFuncTest = KeyUtils.inputKeyDownHandler.bind({
                textContent: expectedTextContent
            });

            spyOn(VisualUtils, 'removeControl');
            spyOn(VisualUtils, 'clearInput');
            spyOn(VisualUtils, 'flashOutput');
            spyOn(Commands, 'execute');
            
            thisFuncTest(testEvent);
        });
        
        it('removes control from the user', function(){
            expect(VisualUtils.removeControl).toHaveBeenCalled();
        });
        
        it('clears the input container', function(){
            expect(VisualUtils.clearInput).toHaveBeenCalled();
        });
        
        it('prints a copy of the current prompt and input', function(){
            expect(VisualUtils.flashOutput).toHaveBeenCalledWith(expectedEchoTxt, outDiv);
        });
        
        it('executes the specified input', function(){
            expect(Commands.execute).toHaveBeenCalledWith(expectedTextContent);
        });
        
        it('prevents the default key event', function(){
            expect(testEvent.preventDefault).toHaveBeenCalled();
        });
    });
    
    describe('is triggered with any other key', function(){
        it('does not prevent the default key event', function(){
            testEvent.keyCode = -1;
            testEvent.preventDefault = jasmine.createSpy('preventDefault');
            KeyUtils.inputKeyDownHandler(testEvent);
            expect(testEvent.preventDefault).not.toHaveBeenCalled();
        });
    });
});