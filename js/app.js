var App = (function() {
  "use strict";
  var currentVideoIndex;
  var currentVideo;
  var videos;
 
  // This is the public interface of the Module.
  var Module = {
    init: function(options) {
      videos = shuffleArray(options.videos);
      console.log(videos);
      createVideo(0);
      attachEvents();
    }
  }
  
  // private functions below this line
  function attachEvents(){
    $(window).on('videoEnded', function(){
      videoEnded();
    });

    $("#js-mute").on('click', function(){
      currentVideo.toggleMute();
      this.classList.toggle('is-muted');
    });
  }
    
  function createVideo(i){
    console.log(videos[i]);
    // console.log('createVideo(' + i + ')');
    
    if(currentVideo){
      currentVideo.destroy();
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

  function shuffleArray(arr) {
    var i, temp, j, len = arr.length;
    for (i = 0; i < len; i++) {
      j = ~~(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }


  return Module;
}());