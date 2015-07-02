class window.App
  muted = false
  currentVideo = null
  currentVideoIndex = null


  constructor: (videos, createFirstVideo = true) ->
    @videos = @shuffleArray(videos)

    if createFirstVideo
      path = window.location.pathname.split('/')
      if path.indexOf('videos') >= 0
        slug = path[path.indexOf('videos') + 1]
        @createVideo(@getVideoIndexBySlug(slug))
        @hideVideos()
      else
        @createVideo(0)

    @attachEvents()


  getVideoIndexBySlug: (slug) ->
    for item in @videos
      if item.slug == slug
        return @videos.indexOf(item)


  attachEvents: ->
    self = @

    $(window).on "videoEnded", =>
      @videoEnded()

    $(document).on 'click', '.video-link', (e) ->
      e.preventDefault()
      slug = this.getAttribute('data-slug')
      index = self.getVideoIndexBySlug(slug)
      self.createVideo(index, true)
      self.hideVideos()

    $("#js-mute").on "click", ->
      currentVideo.toggleMute()
      muted = !muted
      @classList.toggle "is-muted"

    $('.hide-videos').on 'click', ->
      self.hideVideos()

    $('.show-videos').on 'click', ->
      document.body.classList.remove('is-hiding-menu')
      document.body.classList.remove('is-showing-info')

    $('.show-info').on 'click', ->
      document.body.classList.toggle('is-showing-info')

  hideVideos: ->
    document.body.classList.add('is-hiding-menu')


  createVideo: (i, setUrl = false) ->
    currentVideo.destroy()  if currentVideo
    currentVideo = new Video(videos[i], muted, setUrl)
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