define(function() {
    Brush = {
      currentColor: '#ff9999',
    };

    Brush.MODE_OPT = {
      SINGLE: 'SINGLE',
      COMPLEMENTARY: 'COMPLEMENTARY',
    }
    Brush.mode = Brush.MODE_OPT.COMPLEMENTARY;
    Brush.isSingleMode = function() {
      return (Brush.mode === Brush.MODE_OPT.SINGLE);
    }

    Brush._init = function() {
      // switching brush mode
      var radios = document.getElementsByClassName('brush-type-selector');
      Array.prototype.forEach.call(radios, function(radio) {
        radio.onchange = function(evt) {
          if (evt.target.getAttribute('id') === 'single-shape') {
            Brush.mode = Brush.MODE_OPT.SINGLE;
          }
          else {
            Brush.mode = Brush.MODE_OPT.COMPLEMENTARY;
          }
        };
      });

      // choosing color
      document.getElementsByClassName('default-palette')[0].addEventListener('click', Brush._colorPaletteEventHandler);
    }

    Brush._colorPaletteEventHandler = function(event) {
      var target = event.target;
      if (!target.classList.contains('palette-dot')) return;
      if (target.classList.contains('checked')) return;
      document.getElementsByClassName('palette-dot checked')[0].classList.remove('checked');
      target.classList.add('checked');
      Brush.currentColor = target.getAttribute('color');
    }

    Brush._init();
    return Brush;
});