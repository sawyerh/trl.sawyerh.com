var App = (function() {
  "use strict";
  var currentVideoIndex;
  var currentVideo;
  var videos;
 
  // This is the public interface of the Module.
  var Module = {
    init: function(options) {
      videos = options.videos;
      // var randomVideoIndex = Math.floor(Math.random()*videos.length);
      var randomVideoIndex = 0;
      createVideo(randomVideoIndex);

      $(window).on('videoEnded', function(){
        videoEnded();
      });
    }
  }
  
  // private functions below this line
    
  function createVideo(i){
    console.log('createVideo(' + i + ')');
    currentVideo = Object.create(Video);
    currentVideo.init({
      video: videos[i]
    });

    currentVideoIndex = i;
  }


  function nextVideo(){
    console.log('this.nextVideo');
    createVideo(currentVideoIndex + 1);
  }


  function videoEnded(){
    // Advance to next video

    if(i < videos.length){
      nextVideo();
    } else {
      createVideo(0);
    }
  }


  return Module;
}());