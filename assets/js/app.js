(function() {
  window.App = (function() {
    var currentVideo, currentVideoIndex, muted;

    muted = false;

    currentVideo = null;

    currentVideoIndex = null;

    function App(videos, createFirstVideo) {
      if (createFirstVideo == null) {
        createFirstVideo = true;
      }
      this.videos = this.shuffleArray(videos);
      if (createFirstVideo) {
        this.createVideo(0);
      }
      this.attachEvents();
    }

    App.prototype.attachEvents = function() {
      var _this = this;
      $(window).on("videoEnded", function() {
        return _this.videoEnded();
      });
      return $("#js-mute").on("click", function() {
        currentVideo.toggleMute();
        muted = !muted;
        return this.classList.toggle("is-muted");
      });
    };

    App.prototype.createVideo = function(i) {
      console.log(videos[i]);
      if (currentVideo) {
        currentVideo.destroy();
      }
      currentVideo = new Video(videos[i], muted);
      return currentVideoIndex = i;
    };

    App.prototype.nextVideo = function() {
      return this.createVideo(currentVideoIndex + 1);
    };

    App.prototype.videoEnded = function() {
      if (currentVideoIndex === videos.length - 1) {
        return this.createVideo(0);
      } else {
        return this.nextVideo();
      }
    };

    App.prototype.shuffleArray = function(arr) {
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