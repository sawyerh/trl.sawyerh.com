class window.Video
  muted = false
  videoId = null
  player = null
  provider = null
  permalink = null
  playerElement = document.getElementById('player')


  constructor: (@video, isMuted) ->
    muted = isMuted

    # Set video info
    if @video.youtube
      videoId = @video.youtube
      provider = "youtube"
    else if @video.vimeo
      videoId = @video.vimeo
      provider = "vimeo"

    @embed()


  toggleMute: ->
    @setVolume()


  destroy: ->
    player.destroy()  if provider is "youtube"


  # private
  # ************************************
  embed: =>
    playerElement.innerHTML = ""
    
    if provider is "youtube"
      @createYoutube()
    else if provider is "vimeo"
      @createVimeo()


  setVolume: =>
    unless muted
      # MUTE
      if provider is "youtube"
        player.setVolume 0
      else
        @post "setVolume", "0"
    else
      # UNMUTE
      if provider is "youtube"
        player.setVolume 100
      else
        @post("setVolume", "1")

    muted = !muted


  videoEnded: ->
    $(window).trigger "videoEnded"


  createYoutube: ->
    ytWrap = document.createElement("div")
    playerElement.appendChild(ytWrap)

    player = new YT.Player(ytWrap,
      videoId: videoId
      origin: window.location.origin
      rel: 0 # Don't display related videos
      playerVars:
        showinfo: 0 # hide title and uploader name
        color: "white"
        rel: 0
        autoplay: 1
        iv_load_policy: 3
        controls: 0
      events:
        onReady: @youtubeReady
        onStateChange: @youtubeStateChange
    )


  youtubeReady: ->
    player.setVolume if muted then 0 else 100


  youtubeStateChange: (e) ->
    @videoEnded() if e.data is YT.PlayerState.ENDED


  # Helper function for sending a message to the Vimeo player
  post: (action, value) ->
    data = method: action
    url = player.getAttribute("src").split("?")[0]
    data.value = value if value
    player.contentWindow.postMessage JSON.stringify(data), url


  createVimeo: ->
    iframeURL = "http://player.vimeo.com/video/" + videoId + "?api=1&player_id=vimeoplayer&color=ffffff&autoplay=1&byline=0&portrait=0&title=0"
    iframe = document.createElement("iframe")
    iframe.setAttribute "src", iframeURL
    iframe.setAttribute "frameborder", 0
    iframe.setAttribute "width", 500
    iframe.setAttribute "height", 281
    iframe.setAttribute "webkitAllowFullScreen", true
    iframe.setAttribute "mozallowfullscreen", true
    iframe.setAttribute "allowFullScreen", true
    playerElement.appendChild iframe
    player = iframe
    @setupVimeoEvents()


  setupVimeoEvents: ->
    window.addEventListener "message", @vimeoMessageReceived, false


  vimeoMessageReceived: (e) =>
    data = JSON.parse(e.data)
    switch data.event
      when "ready"
        volume = if muted then "0" else "1"
        @post "addEventListener", "finish"
        @post "setVolume", volume
      when "finish"
        @videoEnded()