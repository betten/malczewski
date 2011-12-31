script src: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js'
style '''
  #portraits { position: relative; margin: 0 auto; height: 600px; width: 800px; overflow: hidden; }
  #portraits .portrait { position: absolute; z-index: 1; }
'''

header ->
  h1 'Malczewski'
  div id: 'header', ->
    h2 id: 'current'
    div id: 'slider'
  div id: 'portraits', ->
    for portrait in @portraits
      img class: 'portrait', src: "/selfportraits/#{portrait.filename}", style: "top: #{300 - parseInt(portrait.center_top || 0)}px; left: #{400 - parseInt(portrait.center_left || 0)}px;", title: portrait.title or portrait.filename

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
    
