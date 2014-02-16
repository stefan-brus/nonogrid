var game = new Game();

$(document).ready(function() {
    // disable right click menu
    $('body').bind("contextmenu",function(){
       return false;
    });

    game.init();
});