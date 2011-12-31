var express = require('express'),
    mongo = require('mongodb'),
    fs = require('fs');

var app = express.createServer(express.logger());

mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

  db.addListener("error", function(error) {
    console.log("Error connecting to MongoLab");
  });

  db.collection("selfportraits", function(error, collection) {
    // load new self portraits into collection, new defined by file name
    // fs.readdir('./public/selfportraits', function(error, files) {
    //   if(error) throw error;
    //   console.dir(files);
    //   collection.find({ 'filename': { '$nin': files } }, function(err, cursor) {
    //     cursor.each(function(error, item) {
    //       console.dir(item);
    //     });
    //   });
    // });
  });

});

app.get('/', function(request, response) {
  fs.readdir('./public/selfportraits', function(error, files) {
    if(error) throw error;
    response.send(files.join("\n"));
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
