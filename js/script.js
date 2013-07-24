var app;

function onYouTubeIframeAPIReady(){
  app = Object.create(App);
  console.log('onYouTubeIframeAPIReady');

  app.init({
    videos: videos
  });
}