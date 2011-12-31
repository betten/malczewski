coffeescript ->
  $(document).ready ->
    $.ajax
      url: '/portraits/all'
      success: (data) ->
        console.log data

header ->
  h1 'Malczewski'
