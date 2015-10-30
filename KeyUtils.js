// inputKeyDownHandler function
// Keydown handler for the command line.
// @param - event: The keydown event.
KeyUtils.inputKeyDownHandler = function(event) {
    if(event.keyCode == KeyUtils.keyCode.ENTER) {
        VisualUtils.removeControl();
        var inputTxt = this.textContent;
        VisualUtils.clearInput();
        VisualUtils.flashOutput('> ' + inputTxt, $('#output'));
        Commands.execute(inputTxt);
    }
    else {
        return;
    }

    event.preventDefault();
};

KeyUtils.keyCode = {
    ENTER: 13,
    UP_ARROW: 38,
    DOWN_ARROW: 40
};