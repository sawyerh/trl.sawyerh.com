class window.App
  muted = false
  currentVideo = null
  currentVideoIndex = null


  constructor: (videos, createFirstVideo = true) ->
    @videos = @shuffleArray(videos)

    if createFirstVideo
      @createVideo(0)
    
    @attachEvents()


  attachEvents: ->
    $(window).on "videoEnded", =>
      @videoEnded()

    $("#js-mute").on "click", ->
      currentVideo.toggleMute()
      muted = !muted
      @classList.toggle "is-muted"


  createVideo: (i) ->
    console.log videos[i]
    currentVideo.destroy()  if currentVideo
    currentVideo = new Video(videos[i], muted)
    currentVideoIndex = i


  nextVideo: ->
    @createVideo currentVideoIndex + 1


  videoEnded: ->
    # Advance to next video
    if currentVideoIndex is videos.length - 1
      @createVideo 0
    else
      @nextVideo()


  shuffleArray: (arr) ->
    i = undefined
    temp = undefined
    j = undefined
    len = arr.length
    i = 0
    while i < len
      j = ~~(Math.random() * (i + 1))
      temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
      i++
    arr