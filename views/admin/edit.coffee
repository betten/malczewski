script src: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js'
style '''
  #portrait { position: relative; }
  #center { position: absolute; height: 50px; width: 150px; cursor: pointer; background: #f00; opacity: 0.5; }
'''

a href: '/admin', 'back to admin'

p 'successfully updated' if updated === true
p 'something went wrong saving, please try again' if updated === false

form action: "/admin/update/#{@portrait.id}", method: 'post', ->
  div ->
    label ->
      text 'title:'
      input type: 'text', name: 'portrait[title]', value: @portrait.title or @portrait.filename
  div id: 'portrait', ->
    div id: 'center'
    img id: 'image', src: "/selfportraits/#{@portrait.filename}"
    input id: 'center_top', type: 'hidden', name: 'portrait[center_top]', value: @portrait.center_top
    input id: 'center_left', type: 'hidden', name: 'portrait[center_left]', value: @portrait.center_left
  div ->
    input type: 'submit', value: 'save'

script "window.center = { top: #{@portrait.center_top}, left: #{@portrait.center_left} };"
coffeescript ->
  $(document).ready ->
    $('#center').css
      'top': (center.top or 0) + 'px'
      'left': (center.left or 0) + 'px'
    $('#portrait').css
      'height': $('#image').height() + 'px'
      'width': $('#image').width() + 'px'
    $('#center').draggable
      'containment': 'parent'
      'stop': (event, ui) ->
        $('#center_top').val(ui.position.top)
        $('#center_left').val(ui.position.left)
