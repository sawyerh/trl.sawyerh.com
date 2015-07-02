(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Video = (function() {
    var muted, permalink, player, playerElement, provider, videoId;

    muted = null;

    videoId = null;

    player = null;

    provider = null;

    permalink = null;

    playerElement = document.getElementById('player');

    function Video(video, isMuted, setUrl) {
      this.video = video;
      if (setUrl == null) {
        setUrl = false;
      }
      this.vimeoMessageReceived = __bind(this.vimeoMessageReceived, this);
      this.youtubeStateChange = __bind(this.youtubeStateChange, this);
      this.setVolume = __bind(this.setVolume, this);
      this.embed = __bind(this.embed, this);
      muted = isMuted;
      if (this.video.youtube) {
        videoId = this.video.youtube;
        provider = "youtube";
      } else if (this.video.vimeo) {
        videoId = this.video.vimeo;
        provider = "vimeo";
      }
      document.title = this.video.title;
      this.info();
      this.embed();
      if (setUrl) {
        this.updateURL();
      }
    }

    Video.prototype.toggleMute = function() {
      return this.setVolume();
    };

    Video.prototype.destroy = function() {
      if (provider === "youtube") {
        return player.destroy();
      }
    };

    Video.prototype.info = function() {
      var artist, slug, title;
      title = document.querySelector('.video-title');
      artist = document.querySelector('.video-artist');
      slug = document.querySelector('.video-slug');
      title.innerHTML = this.video.title;
      artist.innerHTML = this.video.artist;
      return slug.innerHTML = this.video.slug;
    };

    Video.prototype.embed = function() {
      playerElement.innerHTML = "";
      if (provider === "youtube") {
        return this.createYoutube();
      } else if (provider === "vimeo") {
        return this.createVimeo();
      }
    };

    Video.prototype.updateURL = function() {
      if (window.history && window.history.pushState) {
        return window.history.pushState({}, document.title, this.video.url);
      }
    };

    Video.prototype.setVolume = function() {
      if (!muted) {
        if (provider === "youtube") {
          player.setVolume(0);
        } else {
          this.post("setVolume", "0");
        }
      } else {
        if (provider === "youtube") {
          player.setVolume(100);
        } else {
          this.post("setVolume", "1");
        }
      }
      return muted = !muted;
    };

    Video.prototype.videoEnded = function() {
      return $(window).trigger("videoEnded");
    };

    Video.prototype.createYoutube = function() {
      var ytWrap;
      ytWrap = document.createElement("div");
      playerElement.appendChild(ytWrap);
      return player = new YT.Player(ytWrap, {
        videoId: videoId,
        origin: window.location.origin,
        rel: 0,
        playerVars: {
          showinfo: 0,
          color: "white",
          rel: 0,
          autoplay: 1,
          iv_load_policy: 3,
          controls: 0
        },
        events: {
          onReady: this.youtubeReady,
          onStateChange: this.youtubeStateChange
        }
      });
    };

    Video.prototype.youtubeReady = function() {
      return player.setVolume(muted ? 0 : 100);
    };

    Video.prototype.youtubeStateChange = function(e) {
      if (e.data === YT.PlayerState.ENDED) {
        return this.videoEnded();
      }
    };

    Video.prototype.post = function(action, value) {
      var data, url;
      data = {
        method: action
      };
      url = player.getAttribute("src").split("?")[0];
      if (value) {
        data.value = value;
      }
      return player.contentWindow.postMessage(JSON.stringify(data), url);
    };

    Video.prototype.createVimeo = function() {
      var iframe, iframeURL;
      iframeURL = "http://player.vimeo.com/video/" + videoId + "?api=1&player_id=vimeoplayer&color=ffffff&autoplay=1&byline=0&portrait=0&title=0";
      iframe = document.createElement("iframe");
      iframe.setAttribute("src", iframeURL);
      iframe.setAttribute("frameborder", 0);
      iframe.setAttribute("width", 500);
      iframe.setAttribute("height", 281);
      iframe.setAttribute("webkitAllowFullScreen", true);
      iframe.setAttribute("mozallowfullscreen", true);
      iframe.setAttribute("allowFullScreen", true);
      playerElement.appendChild(iframe);
      player = iframe;
      return this.setupVimeoEvents();
    };

    Video.prototype.setupVimeoEvents = function() {
      return window.addEventListener("message", this.vimeoMessageReceived, false);
    };

    Video.prototype.vimeoMessageReceived = function(e) {
      var data, volume;
      data = JSON.parse(e.data);
      switch (data.event) {
        case "ready":
          volume = muted ? "0" : "1";
          this.post("addEventListener", "finish");
          return this.post("setVolume", volume);
        case "finish":
          return this.videoEnded();
      }
    };

    return Video;

  })();

}).call(this);
