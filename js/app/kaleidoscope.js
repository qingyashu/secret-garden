define(['app/ring', 'app/svg-canvas', 'app/painter', 'app/utils'], function(Ring, SVGCanvas, Painter, Utils) {
    class Kaleidoscope{
      constructor(svgCanvas, radius, center) {
        
        var outerGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgCanvas.appendChild(outerGElement);
        var outerG = new SVGCanvas(outerGElement);
        outerG.translate(center.x, center.y);
        var innerGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        outerG.appendChild(innerGElement);
        this._svg = new SVGCanvas(innerGElement);
        // this._svg.setRotatable(true);

        this._center = {x: 0, y: 0};
        this._radius = radius;
        this._ringList = [];
        this._MAX_RING_NUM = 10;
        this._MIN_RING_NUM = 4;
        this._generateRingList();
      }

      draw() {
        this._ringList.forEach(function(ring) {
          ring.draw();
        });
        this._drawBackground();
      }

      _drawBackground() {
        var circle = Painter.drawCircle(this._svg, this._center.x, this._center.y, this._radius, {fill: Utils.settings.bgColor});
        var parent = circle.parentElement;
        parent.insertBefore(circle, parent.firstChild);
      }
      
      resize() {
        this._width = this._svg.getWidth();
        this._height = this._svg.getHeight();
      }

      _generateRingList() {
        this._numRing = Math.floor(Math.random() * (this._MAX_RING_NUM - this._MIN_RING_NUM) + this._MIN_RING_NUM);
        // this._numRing = 2;
        var sepList = [0];
        var avg = this._radius / this._numRing;
        var pos = 0;
        for (var i = 0; i < this._numRing-1; i ++) {
          var r = Math.random() * avg + avg / 2;
          pos += r;
          if (pos < this._radius) {
            sepList.push(pos);
          }
        }
        sepList.push(this._radius);
        // for (var i = 1; i < sepList.length; i ++) {
        for (var i = sepList.length-1; i >= 1; i --) {
          var ring = new Ring(this._svg, this._center, sepList[i-1], sepList[i]);
          this._ringList.push(ring);
        }
      }

    }
    return Kaleidoscope;
});