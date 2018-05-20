define(['app/svg-canvas', 'app/painter', 'app/utils'], function(SVGCanvas, Painter, Utils) {
    class Ring {
      constructor(svgCanvas, centerPos, innerRadius, outerRadius, numSector) {
        var gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgCanvas.appendChild(gElement);
        this._svg = new SVGCanvas(gElement);

        this._centerPos = centerPos;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;
        this._MIN_SECTOR = 6;
        this._MAX_SECTOR = 20;
        if (numSector == undefined) {
          this._numSector = Math.floor(Math.random() * (this._MAX_SECTOR - this._MIN_SECTOR) + this._MIN_SECTOR);
          this._numSector = this._numSector % 2 === 1 ? this._numSector - 1 : this._numSector;
        } else {
          this._numSector = numSector;
        }
        this._contentType = Utils.random(0, 5);
        if (this._outerRadius < this._innerRadius) {
          console.log(this);
        }
      }

      draw() {
        this._drawInnerContent();
        this._drawOuterCircle();
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
        Painter.drawCircle(this._svg, cx, cy, r);
      }

      _drawTriangleInSector(startAngle, endAngle) {
        var leftx = this._innerRadius * Math.cos(startAngle) + this._centerPos.x;
        var lefty = this._innerRadius * Math.sin(startAngle) + this._centerPos.y;
        var rightx = this._innerRadius * Math.cos(endAngle) + this._centerPos.x;
        var righty = this._innerRadius * Math.sin(endAngle) + this._centerPos.y;
        var midAngle = (startAngle + endAngle) / 2;
        var midx = this._outerRadius * Math.cos(midAngle) + this._centerPos.x;
        var midy = this._outerRadius * Math.sin(midAngle) + this._centerPos.y;
        Painter.drawLine(this._svg, leftx, lefty, midx, midy);
        Painter.drawLine(this._svg, rightx, righty, midx, midy);
      }

      _drawDoubleTriangleInSector(startAngle, endAngle) {
        this._drawTriangleInSector(startAngle, endAngle);

        // inner triangle
        var midAngle = (startAngle + endAngle) / 2;
        var innerStartAngle = startAngle + (endAngle - startAngle) / 4;
        var innerEndAngle = endAngle - (endAngle - startAngle) / 4;
        var leftInnerX = this._innerRadius * Math.cos(innerStartAngle) + this._centerPos.x;
        var leftInnerY = this._innerRadius * Math.sin(innerStartAngle) + this._centerPos.y;
        var rightInnerX = this._innerRadius * Math.cos(innerEndAngle) + this._centerPos.x;
        var rightInnerY = this._innerRadius * Math.sin(innerEndAngle) + this._centerPos.y;
        var mid2x = (this._innerRadius + this._outerRadius) / 2 * Math.cos(midAngle) + this._centerPos.x;
        var mid2y = (this._innerRadius + this._outerRadius) / 2 * Math.sin(midAngle) + this._centerPos.y;
        Painter.drawLine(this._svg, leftInnerX, leftInnerY, mid2x, mid2y);
        Painter.drawLine(this._svg, rightInnerX, rightInnerY, mid2x, mid2y);
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
        Painter.drawArc(this._svg, leftx, lefty, rx, ry, midAngle / Math.PI * 180, 1, 1, rightx, righty);
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
        Painter.drawArc(this._svg, leftInnerX, leftInnerY, r2x, r2y, midAngle / Math.PI * 180, 0, 1, rightInnerX, rightInnerY);
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
        Painter.drawArc(this._svg, x1, y1, rx, ry, angleX / Math.PI * 180, 0, 1, x2, y2);
      }

      _drawOuterCircle() {
        Painter.drawCircle(this._svg, this._centerPos.x, this._centerPos.y, this._outerRadius, {
          fill: 'white',
          "fill-opacity": '0'
        });
      }
    }
    return Ring;
});