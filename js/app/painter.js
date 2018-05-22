define(['app/svg-canvas', 'app/utils'], function(SVGCanvas, Utils) {
    Painter = {};

    Painter.drawCircle = function(svg, cx, cy, r, style) {
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.setAttribute('cx', cx);
      node.setAttribute('cy', cy);
      node.setAttribute('r', r);
      var fill = (style && style['fill']) ? style['fill'] : Utils.settings.fillColor;
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
      return node;
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
      return node;
    }

    Painter.drawDonus = function(svg, cx, cy, innerRadius, outerRadius, style) {
      var pathStr = 'M ' + cx + ', ' + cy + ' '
        + 'm 0, -' + outerRadius + ' '
        + 'a ' + outerRadius + ', ' + outerRadius + ', 0, 1, 0, 1, 0 '
        + 'Z '
        + 'm 0 ' + (outerRadius - innerRadius) + ' '
        + 'a ' + innerRadius + ', ' + innerRadius + ', 0, 1, 1, -1, 0 '
        + 'Z ';
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      node.setAttribute('d', pathStr);
      var fill = (style && style['fill']) ? style['fill'] : 'none';
      var stroke = (style && style['stroke']) ? style['stroke'] : Utils.settings.strokeColor;
      var strokeWidth = (style && style['stroke-width']) ? style['stroke-width'] : '1';
      node.setAttribute('fill', fill);
      node.setAttribute('stroke', stroke);
      node.setAttribute('stroke-width', strokeWidth);
      svg.appendChild(node);
      return node;
    }

    Painter.drawDonusArc = function(svg, centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, style) {
      var ax = outerRadius * Math.cos(startAngle) + centerX;
      var ay = outerRadius * Math.sin(startAngle) + centerY;
      var bx = outerRadius * Math.cos(endAngle) + centerX;
      var by = outerRadius * Math.sin(endAngle) + centerY;
      var cx = innerRadius * Math.cos(endAngle) + centerX;
      var cy = innerRadius * Math.sin(endAngle) + centerY;
      var dx = innerRadius * Math.cos(startAngle) + centerX;
      var dy = innerRadius * Math.sin(startAngle) + centerY;
      var pathStr = 'M ' + ax + ', ' + ay + ' '
        + 'A ' + outerRadius + ', ' + outerRadius + ' 0, 0, 1, ' + bx + ',' + by + ' '
        + 'L ' + cx + ',' + cy
        + 'A ' + innerRadius + ', ' + innerRadius + ' 0, 1, 1, ' + dx + ',' + dy + ' '
        + 'Z ';
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      node.setAttribute('d', pathStr);
      var fill = (style && style['fill']) ? style['fill'] : 'none';
      var stroke = (style && style['stroke']) ? style['stroke'] : Utils.settings.strokeColor;
      var strokeWidth = (style && style['stroke-width']) ? style['stroke-width'] : '1';
      node.setAttribute('fill', fill);
      node.setAttribute('stroke', stroke);
      node.setAttribute('stroke-width', strokeWidth);
      svg.appendChild(node);
      return node;
    }

    Painter.getEllipseArcString = function(sx, sy, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, ex, ey, isContinue) {
      var pathStr = ' A' + rx + ',' + ry + ' ' 
                        + xAxisRotation + ' '
                        + (largeArcFlag?'1':'0') + ','
                        + (sweepFlag?'1':'0') + ' '
                        + ex + ',' + ey;
      if (!isContinue) {
        pathStr = 'M' + sx + ',' + sy + pathStr;
      }
      return pathStr;
    }

    Painter.getCircleArcString = function(centerX, centerY, startAngle, endAngle, radius, isContinue) {
      var ax = radius * Math.cos(startAngle) + centerX;
      var ay = radius * Math.sin(startAngle) + centerY;
      var bx = radius * Math.cos(endAngle) + centerX;
      var by = radius * Math.sin(endAngle) + centerY;
      var largeArcFlag = startAngle < endAngle ? 0 : 1;
      var pathStr = ' A' + radius + ',' + radius + ' 0 ' + largeArcFlag + ' 1 '
                        + bx + ',' + by;
      if (!isContinue) {
        pathStr = 'M' + ax + ',' + ay + pathStr;
      }
      return pathStr;
    }

    Painter.drawPath = function(svg, pathStr, style) {
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      node.setAttribute('d', pathStr);
      var fill = (style && style['fill']) ? style['fill'] : Utils.settings.fillColor;
      var stroke = (style && style['stroke']) ? style['stroke'] : Utils.settings.strokeColor;
      var strokeWidth = (style && style['stroke-width']) ? style['stroke-width'] : '1';
      node.setAttribute('fill', fill);
      node.setAttribute('stroke', stroke);
      node.setAttribute('stroke-width', strokeWidth);
      svg.appendChild(node);
      return node;
    }

    return Painter;
});
