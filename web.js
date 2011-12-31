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
          for(var i in files) {
            collection.insert({ 'filename': files[i] });
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

    db.collection("selfportraits", function(error, collection) {
      collection.count(function(err, count) {
        console.log("There are " + count + " records.");
      });

      collection.find(function(error, cursor) {
        var output = "<div>output:</div>";
        console.log("output:");
        cursor.toArray(function(error, docs) {
          docs.forEach(function(doc) {
            output += "<div>" + doc.filename + "</div>";
            console.dir(doc);
          });
        });
        response.send(output);
      });
    });

  });

});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
