var app;

function onYouTubeIframeAPIReady(){
  app = Object.create(App);

  app.init({
    videos: videos
  });
}