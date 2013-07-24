(function() {
  describe('App', function() {
    var app;
    app = null;
    beforeEach(function() {
      var vids;
      vids = [
        {
          url: "http://trl.sawyerhollenshead.com/videos/retrograde",
          youtube: "6p6PcFFUm5I"
        }, {
          url: "http://trl.sawyerhollenshead.com/videos/retrograde",
          youtube: "6p6PcFFUm5I"
        }
      ];
      return app = new App(vids, false);
    });
    afterEach(function() {
      return app = null;
    });
    return describe('shuffleArray', function() {
      return it('should preserve all array elements', function() {
        var a;
        a = [1, 2, 3];
        return app.shuffleArray(a).length.should.eq(3);
      });
    });
  });

}).call(this);
