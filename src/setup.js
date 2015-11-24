// startUp function
// Function that is run when the document is ready.
Setup.startUp = function() {
    $('#input').on('keydown', KeyUtils.inputKeyDownHandler);
    $('#input').focus();
    system = new System();
};

$(document).ready(function() {
    Setup.startUp();
});
