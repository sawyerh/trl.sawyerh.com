(function() {
  window.App = (function() {
    var currentVideo, currentVideoIndex, muted;

    muted = false;

    currentVideo = null;

    currentVideoIndex = null;

    function App(videos, createFirstVideo) {
      var path, slug;
      if (createFirstVideo == null) {
        createFirstVideo = true;
      }
      this.videos = this.shuffleArray(videos);
      if (createFirstVideo) {
        path = window.location.pathname.split('/');
        if (path.indexOf('videos') >= 0) {
          slug = path[path.indexOf('videos') + 1];
          this.createVideo(this.getVideoIndexBySlug(slug));
          this.hideVideos();
        } else {
          this.createVideo(0);
        }
      }
      this.attachEvents();
    }

    App.prototype.getVideoIndexBySlug = function(slug) {
      var item, _i, _len, _ref;
      _ref = this.videos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.slug === slug) {
          return this.videos.indexOf(item);
        }
      }
    };

    App.prototype.attachEvents = function() {
      var self,
        _this = this;
      self = this;
      $(window).on("videoEnded", function() {
        return _this.videoEnded();
      });
      $(document).on('click', '.video-link', function(e) {
        var index, slug;
        e.preventDefault();
        slug = this.getAttribute('data-slug');
        index = self.getVideoIndexBySlug(slug);
        self.createVideo(index, true);
        return self.hideVideos();
      });
      $("#js-mute").on("click", function() {
        currentVideo.toggleMute();
        muted = !muted;
        return this.classList.toggle("is-muted");
      });
      $('.hide-videos').on('click', function() {
        return self.hideVideos();
      });
      $('.show-videos').on('click', function() {
        document.body.classList.remove('is-hiding-menu');
        return document.body.classList.remove('is-showing-info');
      });
      return $('.show-info').on('click', function() {
        return document.body.classList.toggle('is-showing-info');
      });
    };

    App.prototype.hideVideos = function() {
      return document.body.classList.add('is-hiding-menu');
    };

    App.prototype.createVideo = function(i, setUrl) {
      if (setUrl == null) {
        setUrl = false;
      }
      if (currentVideo) {
        currentVideo.destroy();
      }
      currentVideo = new Video(videos[i], muted, setUrl);
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
