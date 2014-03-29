function Game() {
    ///////////////
    // CONSTANTS //
    ///////////////

    // jQuery mousedown event constants
    this.EVENT_LEFT_CLICK = 1;

    this.EVENT_RIGHT_CLICK = 3;

    /////////////////////
    // GAME PROPERTIES //
    /////////////////////

    // the game grid model
    this.grid = new Grid(5, 5);
}

/////////////
// METHODS //
/////////////

Game.prototype.init = function() {
    var game = this;

    this.grid.init();

    // initialize 'drag and paint'-functionality
    $('.grid-cell').mousedown(function(event) {
        var row = game.getCellNumber($(this).parent().attr('id'));
        var col = game.getCellNumber($(this).attr('id'));
        var cur_state = game.grid.cells[row][col];

        if(event.which === game.EVENT_LEFT_CLICK) {
            var new_state =
                cur_state === CellState.MARKED || cur_state === CellState.EMPTY
                ? CellState.FILLED
                : CellState.EMPTY;

            game.fill(this, new_state);
            $('.grid-cell').mouseover(function() {
                game.fill(this, new_state);
            });
        }
        else if(event.which === game.EVENT_RIGHT_CLICK) {
            var new_state =
                cur_state === CellState.EMPTY || cur_state === CellState.FILLED
                ? CellState.MARKED
                : CellState.EMPTY;

            game.fill(this, new_state);
            $('.grid-cell').mouseover(function() {
                game.fill(this, new_state);
            });
        }
    });

    // stop 'drag and paint' when mouse button is released
    $(document).mouseup(function() {
        $('.grid-cell').unbind('mouseover');
    });
}

Game.prototype.fill = function(cell, new_state) {
    var row = this.getCellNumber($(cell).parent().attr('id'));
    var col = this.getCellNumber($(cell).attr('id'));

    switch(new_state) {
        case CellState.MARKED:
            $(cell).css({'background-color': '#FFFFFF'});
            $(cell).text('X');
            this.grid.cells[row][col] = CellState.MARKED;
            break;
        case CellState.EMPTY:
            $(cell).empty();
            $(cell).css('background-color', '#FFFFFF');
            this.grid.cells[row][col] = CellState.EMPTY;
            break;
        case CellState.FILLED:
            $(cell).empty();
            $(cell).css('background-color', '#000000');
            this.grid.cells[row][col] = CellState.FILLED;
            break;
        default:
            break;
    }
}

// gets the row or column number of the given id string
// replaces all non digits with an empty string
Game.prototype.getCellNumber = function(id) {
    return Number(id.replace( /^\D+/g, '')) - 1;
}
