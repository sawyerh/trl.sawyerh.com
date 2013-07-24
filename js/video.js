(function() {
  window.Video = (function() {
    var createVimeo, createYoutube, embed, muted, permalink, player, playerElement, post, provider, setVolume, setupVimeoEvents, videoEnded, videoId, vimeoMessageReceived, youtubeReady, youtubeStateChange;

    muted = false;

    videoId = null;

    player = null;

    provider = null;

    permalink = null;

    playerElement = document.getElementById('player');

    function Video(video, isMuted) {
      this.video = video;
      muted = isMuted;
      if (this.video.youtube) {
        videoId = this.video.youtube;
        provider = "youtube";
      } else if (this.video.vimeo) {
        videoId = this.video.vimeo;
        provider = "vimeo";
      }
      embed();
    }

    Video.prototype.toggleMute = function() {
      return setVolume();
    };

    Video.prototype.destroy = function() {
      if (provider === "youtube") {
        return player.destroy();
      }
    };

    embed = function() {
      playerElement.innerHTML = "";
      if (provider === "youtube") {
        return createYoutube();
      } else if (provider === "vimeo") {
        return createVimeo();
      }
    };

    setVolume = function() {
      if (!muted) {
        if (provider === "youtube") {
          player.setVolume(0);
        } else {
          post("setVolume", "0");
        }
      } else {
        if (provider === "youtube") {
          player.setVolume(100);
        } else {
          post("setVolume", "1");
        }
      }
      return muted = !muted;
    };

    videoEnded = function() {
      return $(window).trigger("videoEnded");
    };

    createYoutube = function() {
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
          onReady: youtubeReady,
          onStateChange: youtubeStateChange
        }
      });
    };

    youtubeReady = function() {
      return player.setVolume(muted ? 0 : 100);
    };

    youtubeStateChange = function(e) {
      if (e.data === YT.PlayerState.ENDED) {
        return videoEnded();
      }
    };

    post = function(action, value) {
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

    createVimeo = function() {
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
      return setupVimeoEvents();
    };

    setupVimeoEvents = function() {
      return window.addEventListener("message", vimeoMessageReceived, false);
    };

    vimeoMessageReceived = function(e) {
      var data, volume;
      data = JSON.parse(e.data);
      switch (data.event) {
        case "ready":
          volume = muted ? "0" : "1";
          post("addEventListener", "finish");
          return post("setVolume", volume);
        case "finish":
          return videoEnded();
      }
    };

    return Video;

  })();

}).call(this);
