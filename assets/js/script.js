(function() {
  window.onYouTubeIframeAPIReady = function() {
    var app;
    console.log('onYouTubeIframeAPIReady');
    return app = new App(videos);
  };

}).call(this);
