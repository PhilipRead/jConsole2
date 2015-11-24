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