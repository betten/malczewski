coffeescript ->
  $(document).ready ->
    $.ajax
      url: '/portraits/all'
      success: (data) ->
        $('#portraits').append "<div><img src='/selfportraits/" + p.filename + "' height='100' /> " + p.filename + " <a href='/admin/edit/" + p._id + "'>edit</a></div>" for p in data

header ->
  h1 'Malczewski'
  div '#portraits'

