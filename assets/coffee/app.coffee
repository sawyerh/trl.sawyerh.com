class window.App
  muted = false
  currentVideo = null
  currentVideoIndex = null


  constructor: (createFirstVideo = true) ->
    self = this

    $.ajax({
      url: '/videos-data.js'
      dataType: 'JSON'
    }).done (data) ->
      try
        self.videos = JSON.parse(data)
      catch
        self.videos = data

      self.shuffledVideos = self.shuffleArray(self.videos.concat([]))

      if createFirstVideo
        path = window.location.pathname.split('/')
        if path.indexOf('videos') >= 0
          slug = path[path.indexOf('videos') + 1]
          self.createVideo(self.getVideoIndexBySlug(slug))
          self.hideVideos()
        else
          self.createVideo(0)

      self.attachEvents()
      self.createNav()


  getVideoIndexBySlug: (slug) ->
    for item in @shuffledVideos
      if item.slug == slug
        return @shuffledVideos.indexOf(item)


  createNav: ->
    videosEl = document.querySelector('.videos')
    frag = document.createDocumentFragment()

    for video in this.videos
      href = document.createElement('a')
      href.setAttribute('href', video.url)
      href.setAttribute('data-slug', video.slug)
      href.classList.add('video-link')

      if video.artist
        artist = document.createElement('span')
        artist.classList.add('artist')
        artist.innerHTML = video.artist
        href.appendChild(artist)

      title = document.createElement('span')
      title.classList.add('title')
      title.innerHTML = video.title
      href.appendChild(title)

      if video.youtube
        img = document.createElement('img')
        img.setAttribute('src', 'http://img.youtube.com/vi/' + video.youtube + '/mqdefault.jpg')
        img.setAttribute('height', 100)
        href.appendChild(img)

      frag.appendChild(href)

    videosEl.appendChild(frag)

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
    currentVideo = new Video(this.shuffledVideos[i], muted, setUrl)
    currentVideoIndex = i


  nextVideo: ->
    @createVideo currentVideoIndex + 1


  videoEnded: ->
    # Advance to next video
    if currentVideoIndex is this.shuffledVideos.length - 1
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