define(['app/svg-canvas', 'app/painter', 'app/utils', 'app/brush'], function(SVGCanvas, Painter, Utils, Brush) {
    class Ring {
      constructor(svgCanvas, centerPos, innerRadius, outerRadius, numSector) {
        var gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgCanvas.appendChild(gElement);
        this._svg = new SVGCanvas(gElement);
        this._centerPos = centerPos;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;
        this._isCenterCircle = false;
        this._isOuterCircle = false;
        this._numSector = numSector;
      }

      setIsCenterCircle(flag) {
        this._isCenterCircle = flag;
      }

      setIsOuterCircle(flag) {
        this._isOuterCircle = flag;
      }

      _generatePattern() {
        this._MIN_SECTOR = 6;
        this._MAX_SECTOR = 20;
        if (this._numSector == undefined) {
          this._numSector = Math.floor(Math.random() * (this._MAX_SECTOR - this._MIN_SECTOR) + this._MIN_SECTOR);
          this._numSector = this._numSector % 2 === 1 ? this._numSector - 1 : this._numSector;
        }
        this._contentType = Utils.random(0, 5);
        if (this._isCenterCircle && (this._contentType === 2 || this._contentType === 4)) {
          this._contentType -= 1;
        }
        var patternString = {
          0: 'ring-circle-pattern',
          1: 'ring-triangle-pattern',
          2: 'ring-pedal-pattern',
          3: 'ring-arc-pattern',
          4: 'ring-double-pedal-pattern',
          5: 'ring-double-triangle-pattern',
        };
        this._svg.addClass(patternString[this._contentType]);
      }

      draw() {
        this._generatePattern();
        this._drawInnerContent();
      }

      _drawInnerContent() {
        var angle = Math.PI * 2 / this._numSector;
        var startAngle = 0;
        var endAngle = angle;
        for (var i = 0; i < this._numSector; i ++) {
          this._drawInnerContentSector(startAngle, endAngle);
          startAngle += angle;
          endAngle += angle;
        }
      }

      _drawInnerContentSector(startAngle, endAngle) {
        switch (this._contentType) {
          case 0: 
            this._drawCircleInSector(startAngle, endAngle);
            break;
          case 1:
            this._drawTriangleInSector(startAngle, endAngle);
            break;
          case 2:
            this._drawArcInSector(startAngle, endAngle);
            break;
          case 3:
            this._drawLineInSector(startAngle, endAngle);
            break;
          case 4:
            this._drawDoubleArcInSector(startAngle, endAngle);
            break;
          case 5:
            this._drawDoubleTriangleInSector(startAngle, endAngle);
            break;
        }
      }

      _drawCircleInSector(startAngle, endAngle) {
        var midRadius = (this._innerRadius + this._outerRadius) / 2;
        var midAngle = (startAngle + endAngle) / 2;
        var cx = midRadius * Math.cos(midAngle) + this._centerPos.x;
        var cy = midRadius * Math.sin(midAngle) + this._centerPos.y;
        var r = (this._outerRadius - this._innerRadius) / 2;

        // space between this and next circle
        var nextMidAndle = endAngle + (endAngle - startAngle) / 2;
        var c2x = midRadius * Math.cos(midAngle) + this._centerPos.x;
        var c2y = midRadius * Math.sin(midAngle) + this._centerPos.y;
        var rightInnerX = this._innerRadius * Math.cos(nextMidAndle) + this._centerPos.x;
        var rightInnerY = this._innerRadius * Math.sin(nextMidAndle) + this._centerPos.y;
        var rightOuterX = this._outerRadius * Math.cos(nextMidAndle) + this._centerPos.x;
        var rightOuterY = this._outerRadius * Math.sin(nextMidAndle) + this._centerPos.y;
        var leftOuterX = this._outerRadius * Math.cos(midAngle) + this._centerPos.x;
        var leftOuterY = this._outerRadius * Math.sin(midAngle) + this._centerPos.y;
        var leftInnerX = this._innerRadius * Math.cos(midAngle) + this._centerPos.x;
        var leftInnerY = this._innerRadius * Math.sin(midAngle) + this._centerPos.y;
        var leftCircleArc = Painter.getEllipseArcString(leftInnerX, leftInnerY, r, r, 0, 1, 0, leftOuterX, leftOuterY);
        var outerCircleArc = Painter.getEllipseArcString(leftOuterX, leftOuterY, this._outerRadius, this._outerRadius, 0, 0, 1, rightOuterX, rightOuterY, true);
        var rightCircleArc = Painter.getEllipseArcString(rightOuterX, rightOuterY, r, r, 0, 1, 0, rightInnerX, rightInnerY, true);
        var innerCircleArc = Painter.getEllipseArcString(rightInnerX, rightInnerY, this._outerRadius, this._outerRadius, 0, 0, 1, leftInnerX, leftInnerY, true);
        var pathString = leftCircleArc + outerCircleArc + rightCircleArc + innerCircleArc + 'Z' ;
        var betweenArcNode = Painter.drawPath(this._svg, pathString);
        betweenArcNode.classList.add('pattern-between-circle');

        // circle
        var circleNode = Painter.drawCircle(this._svg, cx, cy, r);
        circleNode.classList.add('pattern-circle');
        
      }

      _drawTriangleInSector(startAngle, endAngle) {
        var midAngle = (startAngle + endAngle) / 2;
        var midx = this._outerRadius * Math.cos(midAngle) + this._centerPos.x;
        var midy = this._outerRadius * Math.sin(midAngle) + this._centerPos.y;
        var pathStr = Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, startAngle, endAngle, this._innerRadius);
        pathStr += ' L' + midx + ',' + midy + 'Z';
        var triangleNode = Painter.drawPath(this._svg, pathStr);
        triangleNode.classList.add('pattern-triangle');

        var nextMidAndle = endAngle + (endAngle - startAngle) / 2;
        var nextPathStr = Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, midAngle, nextMidAndle, this._outerRadius);
        var rightx = this._innerRadius * Math.cos(endAngle) + this._centerPos.x;
        var righty = this._innerRadius * Math.sin(endAngle) + this._centerPos.y;
        nextPathStr += ' L' + rightx + ',' + righty + 'Z';
        var betweenTriangleNode = Painter.drawPath(this._svg, nextPathStr);
        betweenTriangleNode.classList.add('pattern-between-triangle');
      }

      _drawDoubleTriangleInSector(startAngle, endAngle) {
        this._drawTriangleInSector(startAngle, endAngle);

        // inner triangle
        var midAngle = (startAngle + endAngle) / 2;
        var innerStartAngle = startAngle + (endAngle - startAngle) / 4;
        var innerEndAngle = endAngle - (endAngle - startAngle) / 4;
        var mid2x = (this._innerRadius + this._outerRadius) / 2 * Math.cos(midAngle) + this._centerPos.x;
        var mid2y = (this._innerRadius + this._outerRadius) / 2 * Math.sin(midAngle) + this._centerPos.y;
        var pathStr = Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, innerStartAngle, innerEndAngle, this._innerRadius);
        pathStr += ' L' + mid2x + ',' + mid2y + 'Z';
        var innerTriangleNode = Painter.drawPath(this._svg, pathStr);
        innerTriangleNode.classList.add('pattern-inner-triangle');
      }

      _drawArcInSector(startAngle, endAngle) {
        // outer arc
        var leftx = this._innerRadius * Math.cos(startAngle) + this._centerPos.x;
        var lefty = this._innerRadius * Math.sin(startAngle) + this._centerPos.y;
        var rightx = this._innerRadius * Math.cos(endAngle) + this._centerPos.x;
        var righty = this._innerRadius * Math.sin(endAngle) + this._centerPos.y;
        var centerX = (leftx + rightx) / 2;
        var centerY = (lefty + righty) / 2;
        var midAngle = (startAngle + endAngle) / 2;
        var peakX = this._outerRadius * Math.cos(midAngle) + this._centerPos.x;
        var peakY = this._outerRadius * Math.sin(midAngle) + this._centerPos.y;
        var rx = Utils.distance(centerX, centerY, peakX, peakY);
        var ry = Utils.distance(leftx, lefty, rightx, righty) / 2;
        var pathStr = Painter.getEllipseArcString(leftx, lefty, rx, ry, midAngle / Math.PI * 180, 1, 1, rightx, righty);
        pathStr += Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, endAngle, startAngle, this._innerRadius, true);
        var outerArcNode = Painter.drawPath(this._svg, pathStr);
        outerArcNode.classList.add('pattern-outer-pedal');

        // space between this and next arc
        var nextMidAndle = endAngle + (endAngle - startAngle) / 2;
        var nextPeakX = this._outerRadius * Math.cos(nextMidAndle) + this._centerPos.x;
        var nextPeakY = this._outerRadius * Math.sin(nextMidAndle) + this._centerPos.y;
        var circleArc = Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, midAngle, nextMidAndle, this._outerRadius);
        var nextHalfArc = Painter.getEllipseArcString(nextPeakX, nextPeakY, rx, ry, nextMidAndle / Math.PI * 180, 0, 0, rightx, righty, true);
        var halfArc = Painter.getEllipseArcString(rightx, righty, rx, ry, midAngle / Math.PI * 180, 0, 0, peakX, peakY, true);
        var betweenPedalNode = Painter.drawPath(this._svg, circleArc + nextHalfArc + halfArc);
        betweenPedalNode.classList.add('pattern-between-pedal');
      }

      _drawDoubleArcInSector(startAngle, endAngle) {
        this._drawArcInSector(startAngle, endAngle);

        // inner arc
        var midAngle = (startAngle + endAngle) / 2;
        var innerStartAngle = startAngle + (endAngle - startAngle) / 4;
        var innerEndAngle = endAngle - (endAngle - startAngle) / 4;
        var leftInnerX = this._innerRadius * Math.cos(innerStartAngle) + this._centerPos.x;
        var leftInnerY = this._innerRadius * Math.sin(innerStartAngle) + this._centerPos.y;
        var rightInnerX = this._innerRadius * Math.cos(innerEndAngle) + this._centerPos.x;
        var rightInnerY = this._innerRadius * Math.sin(innerEndAngle) + this._centerPos.y;
        var center2X = (leftInnerX + rightInnerX) / 2;
        var center2Y = (leftInnerY + rightInnerY) / 2;
        var peak2X = (this._innerRadius + this._outerRadius) / 2 * Math.cos(midAngle) + this._centerPos.x;
        var peak2Y = (this._innerRadius + this._outerRadius) / 2 * Math.sin(midAngle) + this._centerPos.y;
        var r2x = Utils.distance(center2X, center2Y, peak2X, peak2Y);
        var r2y = Utils.distance(leftInnerX, leftInnerY, rightInnerX, rightInnerY) / 2;
        var pathStr = Painter.getEllipseArcString(leftInnerX, leftInnerY, r2x, r2y, midAngle / Math.PI * 180, 0, 1, rightInnerX, rightInnerY);
        pathStr += Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, innerEndAngle, innerStartAngle, this._innerRadius, true);
        var innerPedalNode = Painter.drawPath(this._svg, pathStr);
        innerPedalNode.classList.add('pattern-inner-pedal');
      }

      _drawLineInSector(startAngle, endAngle) {
        var x1 = this._innerRadius * Math.cos(startAngle) + this._centerPos.x;
        var y1 = this._innerRadius * Math.sin(startAngle) + this._centerPos.y;
        var x2 = this._outerRadius * Math.cos(endAngle) + this._centerPos.x;
        var y2 = this._outerRadius * Math.sin(endAngle) + this._centerPos.y;
        var rx = (this._innerRadius + this._outerRadius) / 2;
        var ry = rx;
        var sin90minusX = this._innerRadius * Math.sin(endAngle - startAngle) / Utils.distance(x1, y1, x2, y2);
        var angle90minusX = Math.asin(sin90minusX);
        var angleX = Math.PI / 2 - angle90minusX;
        var path1 = Painter.getEllipseArcString(x1, y1, rx, ry, angleX / Math.PI * 180, 0, 1, x2, y2);

        var nextEndAngle = endAngle * 2 - startAngle;
        var x3 = this._outerRadius * Math.cos(nextEndAngle) + this._centerPos.x;
        var y3 = this._outerRadius * Math.sin(nextEndAngle) + this._centerPos.y;
        var x4 = this._innerRadius * Math.cos(endAngle) + this._centerPos.x;
        var y4 = this._innerRadius * Math.sin(endAngle) + this._centerPos.y;
        var angleY = angleX + endAngle - startAngle;
        var path2 = Painter.getEllipseArcString(x3, y3, rx, ry, angleY / Math.PI * 180, 0, 0, x4, y4, true);

        var circleArc1Str = Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, endAngle, nextEndAngle, this._outerRadius, true);
        var circleArc2Str = Painter.getCircleArcString(this._centerPos.x, this._centerPos.y, endAngle, startAngle, this._innerRadius, true);

        var pathStr = path1 + circleArc1Str + path2 + circleArc2Str + 'Z';
        var lineNode = Painter.drawPath(this._svg, pathStr);
        lineNode.classList.add('pattern-arc');
      }

      _drawOuterCircle() {
        Painter.drawCircle(this._svg, this._centerPos.x, this._centerPos.y, this._outerRadius, {
          fill: 'white',
          "fill-opacity": '0'
        });
      }

      belongsTo(shapeElement) {
        var p = shapeElement;
        var rootNode = this._svg.getElement();
        while (p) {
          if (p == rootNode) {
            return true;
          }
          p = p.parentElement;
        }
        return false;
      }

      brushColor(shapeElement) {
        if (Brush.isSingleMode()) {
          shapeElement.setAttribute('fill', Brush.currentColor);
        }
        else {
          var p = shapeElement.parentElement;
          var patternClassName = Array.prototype.filter.call(shapeElement.classList, function(c) {
            return c.startsWith('pattern');
          })[0];
          var samePatternChildren = p.getElementsByClassName(patternClassName);
          var indexOfShape = Array.prototype.indexOf.call(samePatternChildren, shapeElement);
          if (samePatternChildren.length % 4 === 0) { // color every 4
            for (var i = indexOfShape % 4; i < samePatternChildren.length; i += 4) {
              samePatternChildren[i].setAttribute('fill', Brush.currentColor);
            }
          }
          else { // color every 2
            for (var i = indexOfShape % 2; i < samePatternChildren.length; i += 2) {
              samePatternChildren[i].setAttribute('fill', Brush.currentColor);
            }
          }
        }
      }
    }
    return Ring;
});