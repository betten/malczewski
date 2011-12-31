coffeescript ->
  $(document).ready ->
    $.ajax
      url: '/portraits/all'
      success: (data) ->
        for portrait in data
          $('#portraits').append "<div><img src='/selfportraits/" + portrait.filename + "' height='100' /> " + portrait.filename + " <a href='/admin/edit/" + portrait.id + "'>edit</a></div>"

header ->
  h1 'Malczewski'
  div id: 'portraits'

