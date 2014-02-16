var Grid = function(rows, cols) {
    /////////////////////
    // GRID PROPERTIES //
    /////////////////////

    this.rows = rows;
    this.cols = cols;

    // 2-dimensional array containing the cells
    this.cells = [];

    this.init = function() {
        for(var i = 0; i < rows; i++) {
            this.cells.push([]);

            for(var j = 0; j < cols; j++) {
                this.cells[i].push(CellState.EMPTY);
            }
        }
    }
}

// Cell state enum
var CellState = {
    EMPTY : "empty cell",
    FILLED: "filled cell",
    MARKED: "marked cell"
}