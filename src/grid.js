function Grid(rows, cols) {
    /////////////////////
    // GRID PROPERTIES //
    /////////////////////

    this.rows = rows;
    this.cols = cols;

    // 2-dimensional array containing the cells
    this.cells = [];
}

Grid.prototype.init = function() {
    for(var i = 0; i < this.rows; i++) {
        this.cells.push([]);

        for(var j = 0; j < this.cols; j++) {
            this.cells[i].push(CellState.EMPTY);
        }
    }
}

// Cell state enum
var CellState = {
    EMPTY : "empty cell",
    FILLED: "filled cell",
    MARKED: "marked cell"
}