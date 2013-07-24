describe 'App', ->

  # SETUP
  # ==================================================
  app = null

  beforeEach ->
    vids = [
      {url: "http://trl.sawyerhollenshead.com/videos/retrograde",youtube: "6p6PcFFUm5I"},
      {url: "http://trl.sawyerhollenshead.com/videos/retrograde", youtube: "6p6PcFFUm5I"}
    ]

    app = new App(vids, false)


  afterEach ->
    app = null



  # TESTS
  # ==================================================

  describe 'shuffleArray', ->

    it 'should preserve all array elements', ->
      a = [1,2,3]
      app.shuffleArray(a).length.should.eq(3)