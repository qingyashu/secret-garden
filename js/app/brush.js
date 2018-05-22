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

    return Brush;
});