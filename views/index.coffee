style '''
  #portraits { position: relative; margin: 0 auto; height: 600px; width: 800px; }
  #portraits .portrait { position: absolute; }
'''

header ->
  h1 'Malczewski'
  div id: 'portraits', ->
    for portrait in @portraits
      img class: 'portrait', src: "/selfportraits/#{portrait.filename}", style: "top: #{300 - parseInt(portrait.center_top || 0)}px; left: #{400 - parseInt(portrait.center_left || 0)}px;"
