link rel: 'stylesheet', type: 'text/css', href: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/vader/jquery-ui.css'
link rel: 'stylesheet', type: 'text/css', href: '/css/colorbox.css'
style '''
  #portraits { position: relative; margin: 20px auto; height: 600px; width: 800px; overflow: hidden; }
  #portraits .portrait { position: absolute; z-index: 1; }
  #slider { width: 800px; margin: 0 auto; }
  #current { text-align: center; }
'''
script type: 'text/javascript', src: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js'
script type: 'text/javascript', src: '/js/jquery.colorbox-min.js'

header ->
  h1 'Malczewski'

  div id: 'header', ->
    h2 id: 'current'
    div id: 'slider'

  div id: 'portraits', ->
    for portrait in @portraits
      img class: 'portrait', src: "/selfportraits/#{portrait.filename}", style: "top: #{300 - parseInt(portrait.center_top || 0)}px; left: #{400 - parseInt(portrait.center_left || 0)}px;", title: portrait.title or portrait.filename

  p -> a href: 'https://github.com/betten/malczewski', target: '_blank', -> 'https://github.com/betten/malczewski'

coffeescript ->
  $(document).ready ->

    portraits = $('#portraits .portrait')

    $('#slider').slider
      value: 0
      min: 0
      max: portraits.length
      slide: (event, ui) ->
        current = portraits.eq(ui.value)
        portraits.css 'z-index': 1
        current.css 'z-index': 99
        $('#current').text(current.attr('title'))

    first = portraits.first()
    first.css 'z-index': 99
    $('#current').text(first.attr('title'))

    portraits.click ->
      $.colorbox
        'href': $(this).attr('src')
        'title': $(this).attr('title')
