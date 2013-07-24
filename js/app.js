(function() {
  window.App = (function() {
    var attachEvents, createVideo, currentVideo, currentVideoIndex, muted, nextVideo, shuffleArray, videoEnded;

    muted = false;

    currentVideo = null;

    currentVideoIndex = null;

    function App(videos) {
      this.videos = shuffleArray(videos);
      createVideo(0);
      attachEvents();
    }

    attachEvents = function() {
      $(window).on("videoEnded", function() {
        return videoEnded();
      });
      return $("#js-mute").on("click", function() {
        currentVideo.toggleMute();
        muted = !muted;
        return this.classList.toggle("is-muted");
      });
    };

    createVideo = function(i) {
      console.log(videos[i]);
      if (currentVideo) {
        currentVideo.destroy();
      }
      currentVideo = new Video(videos[i], muted);
      return currentVideoIndex = i;
    };

    nextVideo = function() {
      return createVideo(currentVideoIndex + 1);
    };

    videoEnded = function() {
      if (currentVideoIndex === videos.length - 1) {
        return createVideo(0);
      } else {
        return nextVideo();
      }
    };

    shuffleArray = function(arr) {
      var i, j, len, temp;
      i = void 0;
      temp = void 0;
      j = void 0;
      len = arr.length;
      i = 0;
      while (i < len) {
        j = ~~(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++;
      }
      return arr;
    };

    return App;

  })();

}).call(this);
