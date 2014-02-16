var Game = function() {
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

    /////////////
    // METHODS //
    /////////////

    this.init = function() {
        var game = this;

        this.grid.init();

        $('.grid-cell').mousedown(function(event) {
            if(event.which === game.EVENT_LEFT_CLICK) {
                game.fill(this, true);
            }
            else if(event.which === game.EVENT_RIGHT_CLICK) {
                game.fill(this, false);
            }
        });
    }

    this.fill = function(cell, left_click) {
        var row = this.getCellNumber($(cell).parent().attr('id'));
        var col = this.getCellNumber($(cell).attr('id'));

        if(left_click) {
            switch (this.grid.cells[row][col]) {
                case CellState.MARKED:
                    $(cell).empty();
                    $(cell).css({'background-color': '#000000'});
                    this.grid.cells[row][col] = CellState.FILLED;
                    break;
                case CellState.EMPTY:
                    $(cell).css('background-color', '#000000');
                    this.grid.cells[row][col] = CellState.FILLED;
                    break;
                case CellState.FILLED:
                    $(cell).css('background-color', '#FFFFFF');
                    this.grid.cells[row][col] = CellState.EMPTY;
                    break;
                default:
                    break;
            }
        }
        else {
            switch (this.grid.cells[row][col]) {
                case CellState.EMPTY:
                case CellState.FILLED:
                    $(cell).css({'background-color': '#FFFFFF'});
                    $(cell).text('X');
                    this.grid.cells[row][col] = CellState.MARKED;
                    break;
                case CellState.MARKED:
                    $(cell).css({'background-color': '#FFFFFF'});
                    $(cell).empty();
                    this.grid.cells[row][col] = CellState.EMPTY;
                    break;
                default:
                    break;
            }
        }
    }

    // gets the row or column number of the given id string
    // replaces all non digits with an empty string
    this.getCellNumber = function(id) {
        return Number(id.replace( /^\D+/g, '')) - 1;
    }
}