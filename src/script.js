$(function () {

  // jQuery event number constants
  var EVENT_LEFT_CLICK = 1;
  var EVENT_RIGHT_CLICK = 3;

  // Cell state enum
  var CellState = {

      EMPTY: "empty-cell",

      FILLED: "filled-cell",

      MARKED: "marked-cell"
  };

  // The expected outcome
  var Solution = Backbone.Model.extend({

    defaults: {
      rows: 5,

      cols: 5,

      grid: [[0,0,0,0,0],
             [0,1,0,1,0],
             [0,0,1,0,0],
             [1,0,0,0,1],
             [0,1,1,1,0]]
    },

    // Matrix transpose the grid
    transpose: function () {
      return _.zip.apply(_, this.get("grid"));
    },

    // Get the row numbers at the given index
    rowNos: function (idx) {
      return this.nos(this.get("grid")[idx]);
    },

    // Get the column numbers at the given index
    colNos: function (idx) {
      return this.nos(this.transpose()[idx]);
    },

    // Get the numbers for the given array of solution numbers
    nos: function (arr) {
      var consec = false;
      var res = [];

      _.each(arr, function(val) {
        if (val === 0) {
          consec = false;
        }
        else {
          if (consec) {
            var lastIdx = res.length - 1;
            res[lastIdx] = res[lastIdx] + 1;
          }
          else {
            res.push(1);
          }

          consec = true;
        }
      });

      return res;
    }
  });

  // Model for one cell
  var Cell = Backbone.Model.extend({

    defaults: { state: CellState.EMPTY },

    update: function (shouldBeMarked) {
      switch (this.get("state")) {
        case CellState.EMPTY:
          this.set("state", shouldBeMarked ? CellState.MARKED : CellState.FILLED);
          break;
        case CellState.FILLED:
          this.set("state", shouldBeMarked ? CellState.MARKED : CellState.EMPTY);
          break;
        case CellState.MARKED:
          this.set("state", shouldBeMarked ? CellState.EMPTY : CellState.FILLED);
          break;
      }
    }
  });

  // Model for one row
  var GridRow = Backbone.Model.extend({

    initialize: function () {
      for (var i = 0; i < solution.get("cols"); i++) {
        this.set( i, new Cell() );
      }
    }
  });

  // Model for the whole grid
  var GridCollection = Backbone.Collection.extend({

    model: GridRow,

    initialize: function () {
      for (var i = 0; i < solution.get("rows"); i++) {
        this.push(new GridRow());
      }
    }
  });

  // View for the column numbers
  var ColsView = Backbone.View.extend({

    el: ".col-numbers",

    initialize: function () {
      this.listenTo(this.model, "change", this.render);
    },

    render: function () {
      var fillerEl = $("<th/>");
      fillerEl.addClass("filler-col");
      this.$el.append(fillerEl);

      var cols = this.model.get("cols");

      for (var i = 0; i < cols; i++) {
        var colEl = $("<th/>");
        colEl.addClass("head-col");
        this.$el.append(colEl);

        colEl.text(this.toColText(this.model.colNos(i)));

        if (i === cols - 1) {
          colEl.addClass("last-cell");
        }
      }
    },

    // Convert column quantities to a line broken table header column content thingy
    toColText: function (arr) {
      return arr.join("\n")
    }
  });

  // State of the art
  var paintState = CellState.EMPTY;

  // View for one cell
  var CellView = Backbone.View.extend({

    tagName: "td",

    className: "grid-cell",

    events: {
      "mousedown": "updateState",
      "mousemove": "paint"
    },

    initialize: function () {
      this.listenTo(this.model, "change", this.render);
    },

    render: function () {
      switch (this.model.get("state")) {
        case CellState.EMPTY:
          this.$el.empty();
          this.$el.css('background-color', '#FFFFFF');
          break;
        case CellState.FILLED:
          this.$el.empty();
          this.$el.css('background-color', '#000000');
          break;
        case CellState.MARKED:
          this.$el.text('X');
          this.$el.css('background-color', '#FFFFFF');
          break;
      }
    },

    updateState: function (e) {
      if (e.which === EVENT_LEFT_CLICK || e.which === EVENT_RIGHT_CLICK) {
        this.model.update(e.which === EVENT_RIGHT_CLICK);
        paintState = this.model.get("state");
      }
    },

    paint: function (e) {
      if (e.which === EVENT_LEFT_CLICK || e.which === EVENT_RIGHT_CLICK) {
        this.model.set("state", paintState);
      }
    }
  });

  // View for one row
  var RowView = Backbone.View.extend({

    tagName: "tr",

    className: "grid-row",

    render: function () {

      for( var i = 0; i < solution.get("cols"); i++ ) {
        var cell = this.model.get(i);
        var view = new CellView({model: cell});

        view.render();

        if (i === solution.get("cols") - 1) {
          view.$el.addClass("last-cell");
        }

        this.$el.append(view.$el);
      }
    }
  });

  // View for the grid
  var GridView = Backbone.View.extend({

    el: ".grid",

    render: function () {
      nonogridCollection.each(function (row, i) {
        var view = new RowView({model: row});

        view.render();

        var rowNoEl = $("<td/>");
        rowNoEl.addClass("row-numbers");
        rowNoEl.text(this.toRowText(solution.rowNos(i)));

        view.$el.prepend(rowNoEl);

        if (i === solution.get("rows") - 1) {
          view.$el.addClass("last-row");
        }

        this.$el.append(view.$el);
      }, this);
    },

    // Convert row quantities to a table left-sidey-content-thingy
    toRowText: function (arr) {
      return arr.join(" ");
    }
  });

  // Disable right click menu
  $("body").bind("contextmenu",function(){
     return false;
  });

  var solution = new Solution();
  var colsView = new ColsView(({model: solution}));
  colsView.render();

  var nonogridCollection = new GridCollection();
  var game = new GridView();
  game.render();

  // Mega hack warning: Sync filler column width with row number column width
  $(".filler-col").width($(".row-numbers").width() + 1);
});
