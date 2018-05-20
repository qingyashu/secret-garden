define(['app/kaleidoscope', 'app/svg-canvas', 'app/utils'], function(Kaleidoscope, SVGCanvas, Utils) {
  class KaleidoscopeDrawer {
    constructor(svgCanvas) {
      this._PADDING = 0;
      this._MIN_SCALE = 1.2;
      this._MAX_SCALE = 2;

      this._svg = svgCanvas;
      this._svg.setBackgroundColor(Utils.settings.bgColor);
      this._width = this._svg.getWidth();
      this._height = this._svg.getHeight();
      
      this._kaleidoscopeList = [];
      this._generateKaleidoscopes();
    }

    _generateKaleidoscopes() {
      var row = 4;
      var col = Math.round(this._width / this._height * 4);
      var rw = (this._width - this._PADDING * 2) / col / 2;
      var rh = (this._height - this._PADDING * 2) / row / 2;
      var r = Math.min(rw, rh);

      var randomOrder = []
      for (var i = 0; i < row; i ++) {
        for (var j = 0; j < col; j ++) {
          randomOrder.push({r: i, c: j});
        }
      }
      Utils.shuffleArray(randomOrder);
      for (var k = 0; k < randomOrder.length; k ++) {
        var i = randomOrder[k].r;
        var j = randomOrder[k].c;
        var cx = this._PADDING + rw*2*j + rw;
        var cy = this._PADDING + rh*2*i + rh;
        var randomScale = this._MIN_SCALE + Math.random() * (this._MAX_SCALE - this._MIN_SCALE);
        var kalei = new Kaleidoscope(this._svg, r * randomScale, {x: cx, y: cy});
        this._kaleidoscopeList.push(kalei);
      }
    }

    draw() {
      this._kaleidoscopeList.forEach(function(k) {
        k.draw();
      });
    }
    
  }
  return KaleidoscopeDrawer;

});