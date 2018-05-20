define(['app/svg-canvas', 'app/utils'], function(SVGCanvas, Utils) {
    Painter = {};

    Painter.drawCircle = function(svg, cx, cy, r, style) {
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.setAttribute('cx', cx);
      node.setAttribute('cy', cy);
      node.setAttribute('r', r);
      var fill = (style && style['fill']) ? style['fill'] : 'none';
      var stroke = (style && style['stroke']) ? style['stroke'] : Utils.settings.strokeColor;
      var strokeWidth = (style && style['stroke-width']) ? style['stroke-width'] : '1';
      node.setAttribute('fill', fill);
      node.setAttribute('stroke', stroke);
      node.setAttribute('stroke-width', strokeWidth);
      if (style && style['fill-opacity']) {
        node.setAttribute('fill-opacity', style['fill-opacity']);
      }
      svg.appendChild(node);
      return node;
    }

    Painter.drawLine = function(svg, x1, y1, x2, y2, style) {
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      node.setAttribute('x1', x1);
      node.setAttribute('y1', y1);
      node.setAttribute('x2', x2);
      node.setAttribute('y2', y2);
      var stroke = (style && style['stroke']) ? style['stroke'] : Utils.settings.strokeColor;
      var strokeWidth = (style && style['stroke-width']) ? style['stroke-width'] : '1';
      node.setAttribute('stroke', stroke);
      node.setAttribute('stroke-width', strokeWidth);
      svg.appendChild(node);
    }

    Painter.drawArc = function(svg, sx, sy, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, ex, ey, style) {
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var pathStr = 'M' + sx + ',' + sy + ' A' + rx + ',' + ry + ' ' 
                        + xAxisRotation + ' '
                        + (largeArcFlag?'1':'0') + ','
                        + (sweepFlag?'1':'0') + ' '
                        + ex + ',' + ey;
      node.setAttribute('d', pathStr);
      var fill = (style && style['fill']) ? style['fill'] : 'none';
      var stroke = (style && style['stroke']) ? style['stroke'] : Utils.settings.strokeColor;
      var strokeWidth = (style && style['stroke-width']) ? style['stroke-width'] : '1';
      node.setAttribute('fill', fill);
      node.setAttribute('stroke', stroke);
      node.setAttribute('stroke-width', strokeWidth);
      svg.appendChild(node);
    }

    return Painter;
});
