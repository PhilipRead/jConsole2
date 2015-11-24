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
});