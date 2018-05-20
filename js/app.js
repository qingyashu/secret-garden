requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['app/kaleidoscope-drawer', 'app/svg-canvas'], function(KaleidoscopeDrawer, SVGCanvas) {
    var svg = document.getElementsByClassName('canvas')[0];
    var svgCanvas = new SVGCanvas(svg);
    var k = new KaleidoscopeDrawer(svgCanvas);
    k.draw();
});