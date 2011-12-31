doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title "Malczewski"

    link rel: 'stylesheet', href: '/css/malczewski.css'

    script src: '/js/jquery.js'

    coffeescript ->
      $(document).ready ->
        $.ajax
          url: '/portraits/all'
          success: (data) ->
            console.log data
  body ->
    header ->
      h1 'Malczewski'
