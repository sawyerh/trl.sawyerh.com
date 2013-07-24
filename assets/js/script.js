(function() {
  window.onYouTubeIframeAPIReady = function() {
    var app;
    app = new App(videos);
    return console.log('onYouTubeIframeAPIReady');
  };

}).call(this);
