requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['app/kaleidoscope-drawer', 'app/svg-canvas', 'app/brush'], function(KaleidoscopeDrawer, SVGCanvas, Brush) {
    var svg = document.getElementsByClassName('canvas')[0];
    var svgCanvas = new SVGCanvas(svg);
    var k = new KaleidoscopeDrawer(svgCanvas);
    k.draw();
});