(function() {
  window.App = (function() {
    var currentVideo, currentVideoIndex, muted;

    muted = false;

    currentVideo = null;

    currentVideoIndex = null;

    function App(createFirstVideo) {
      var self;
      if (createFirstVideo == null) {
        createFirstVideo = true;
      }
      self = this;
      $.ajax({
        url: '/videos-data.js',
        dataType: 'JSON'
      }).done(function(data) {
        var path, slug;
        try {
          self.videos = JSON.parse(data);
        } catch (_error) {
          self.videos = data;
        }
        self.shuffledVideos = self.shuffleArray(self.videos.concat([]));
        if (createFirstVideo) {
          path = window.location.pathname.split('/');
          if (path.indexOf('videos') >= 0) {
            slug = path[path.indexOf('videos') + 1];
            self.createVideo(self.getVideoIndexBySlug(slug));
            self.hideVideos();
          } else {
            self.createVideo(0);
          }
        }
        self.attachEvents();
        return self.createNav();
      });
    }

    App.prototype.getVideoIndexBySlug = function(slug) {
      var item, _i, _len, _ref;
      _ref = this.shuffledVideos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.slug === slug) {
          return this.shuffledVideos.indexOf(item);
        }
      }
    };

    App.prototype.createNav = function() {
      var artist, frag, href, img, title, video, videosEl, _i, _len, _ref;
      videosEl = document.querySelector('.videos');
      frag = document.createDocumentFragment();
      _ref = this.videos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        video = _ref[_i];
        href = document.createElement('a');
        href.setAttribute('href', video.url);
        href.setAttribute('data-slug', video.slug);
        href.classList.add('video-link');
        if (video.artist) {
          artist = document.createElement('span');
          artist.classList.add('artist');
          artist.innerHTML = video.artist;
          href.appendChild(artist);
        }
        title = document.createElement('span');
        title.classList.add('title');
        title.innerHTML = video.title;
        href.appendChild(title);
        if (video.youtube) {
          img = document.createElement('img');
          img.setAttribute('src', 'http://img.youtube.com/vi/' + video.youtube + '/mqdefault.jpg');
          img.setAttribute('height', 100);
          href.appendChild(img);
        }
        frag.appendChild(href);
      }
      return videosEl.appendChild(frag);
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
      currentVideo = new Video(this.shuffledVideos[i], muted, setUrl);
      return currentVideoIndex = i;
    };

    App.prototype.nextVideo = function() {
      return this.createVideo(currentVideoIndex + 1);
    };

    App.prototype.videoEnded = function() {
      if (currentVideoIndex === this.shuffledVideos.length - 1) {
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
