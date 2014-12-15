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

    cols: 5,

    initialize: function () {
      for (var i = 0; i < this.cols; i++) {
        this.set( i, new Cell() );
      }
    }
  });

  // Model for the whole grid
  var GridCollection = Backbone.Collection.extend({

    rows: 5,

    model: GridRow,

    initialize: function () {
      for (var i = 0; i < this.rows; i++) {
        this.push(new GridRow());
      }
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
      for( var i = 0; i < this.model.cols; i++ ) {
        var cell = this.model.get( i );
        var view = new CellView({model: cell});

        view.render();

        if (i === this.model.cols - 1) {
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

        if (i === nonogridCollection.rows - 1) {
          view.$el.addClass("last-row");
        }

        this.$el.append(view.$el);
      }, this);
    }
  });

  // disable right click menu
  $('body').bind("contextmenu",function(){
     return false;
  });

  var nonogridCollection = new GridCollection();
  var game = new GridView();
  game.render();
});
