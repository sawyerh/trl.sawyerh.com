var App = (function() {
  "use strict";
  var currentVideoIndex;
  var currentVideo;
  var videos;
 
  // This is the public interface of the Module.
  var Module = {
    init: function(options) {
      videos = options.videos;
      var randomVideoIndex = Math.floor(Math.random()*videos.length);
      // var randomVideoIndex = 0;
      createVideo(randomVideoIndex);

      $(window).on('videoEnded', function(){
        videoEnded();
      });
    }
  }
  
  // private functions below this line
    
  function createVideo(i){
    console.log(videos[i]);
    // console.log('createVideo(' + i + ')');
    
    if(currentVideo){
      currentVideo.destroy;
    }

    currentVideo = Object.create(Video);
    currentVideo.init({
      video: videos[i]
    });

    currentVideoIndex = i;
  }


  function nextVideo(){
    createVideo(currentVideoIndex + 1);
  }


  function videoEnded(){
    // Advance to next video

    if(currentVideoIndex == videos.length - 1){
      createVideo(0);
    } else {
      nextVideo();
    }
  }


  return Module;
}());