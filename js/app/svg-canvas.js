define(function() {
    class SVGCanvas {
      constructor(svgElement) {
        this._svg = svgElement;
      }
      resize() {
        
      }
      getWidth() {
        return this._svg.getBoundingClientRect().width;
      }
      getHeight() {
        return this._svg.getBoundingClientRect().height;
      }
      appendChild(node) {
        this._svg.appendChild(node);
      }
      translate(x, y) {
        this._svg.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
      }
      scale(x, y) {
        var originTranform = this._svg.getAttribute('transform');
        if (y) {
          this._svg.setAttribute('transform', originTranform + 'scale(' + x + ', ' + y + ')');
        }
        else {
          this._svg.setAttribute('transform', originTranform + 'scale(' + x + ')');
        }
      }
      setBackgroundColor(color) {
        this._svg.style.backgroundColor = color;
      }

      setRotatable(flag) {
        if (flag) {
          this._svg.classList.add('rotatable');
        }
        else {
          this._svg.classList.remove('rotatable');
        }
      }
    }
    return SVGCanvas;
});