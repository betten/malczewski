var express = require('express'),
    mongo = require('mongodb'),
    fs = require('fs');

var app = express.createServer(express.logger());

mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

  db.addListener("error", function(error) {
    console.log("Error connecting to MongoLab");
  });

  db.collection("selfportraits", function(error, collection) {
    fs.readdir('./public/selfportraits', function(error, files) {
      if(error) throw error;
      // remove self portraits from collection no longer in selfportraits dir
      collection.remove({ 'filename': { '$nin': files } });
      // load new self portraits into collection, new defined by file name
      collection.find(function(error, cursor) {
        cursor.toArray(function(error, docs) {
          docs.forEach(function(doc) {
            var i = files.indexOf(doc.filename);
            if(i != -1) files.splice(i, 1);
          });
          console.log('new files:');
          console.dir(files);
          for(file in files) {
            collection.insert({ 'filename': file });
          }
        });
      });
    });
  });

});

app.get('/', function(request, response) {
  
  mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

    db.addListener("error", function(error) {
      console.log("Error connecting to MongoLab");
    });

    collection.find(function(error, cursor) {
      var output = "";
      cursor.each(function(error, doc) {
        if(doc != null) output += "<div>id: " + doc._id + ", filename: " + doc.filename + "</div>";
      });
      response.send(output);
    });

  });

});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
