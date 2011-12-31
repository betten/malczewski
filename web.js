var express = require('express'),
    mongo = require('mongodb'),
    fs = require('fs'),
    bson = mongo.BSONPure;

var app = express.createServer(express.logger());

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'coffee');
  app.register('.coffee', require('coffeekup').adapters.express);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.set('view options', {});
});

var Portrait = {
  get: function(id, callback) {
    console.log('=========================');
    console.log('pre connect id: ' + id);
    console.log('=========================');
    mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

      db.addListener("error", function(error) {
        console.log("Error connecting to MongoLab");
      });

      db.collection("selfportraits", function(error, collection) {
        console.log('=========================');
        console.log('id: ' + id);
        console.log('=========================');
        collection.find({ '_id': new bson.ObjectID(id) }, { 'limit': 1 }, function(error, cursor) {
          cursor.toArray(function(error, docs) {
            console.log(docs[0]);
            callback(docs[0] || {});
          });
        });
      });

    });
  }
};

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
  response.render('index');
});

app.get('/portraits/all', function(request, response) {
  mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

    db.addListener("error", function(error) {
      console.log("Error connecting to MongoLab");
    });

    db.collection("selfportraits", function(error, collection) {
      collection.find({}, { 'sort': 'filename' }, function(error, cursor) {
        cursor.toArray(function(error, docs) {
          response.send(docs);
        });
      });
    });

  });
});

app.get('/portraits/:id', function(request, response) {
  Portrait.get(request.params.id, function(portrait) {
    //response.send(portrait);
    response.send(request.params.id);
  });
  //response.send(request.params.id);
});

app.get('/admin', function(request, response) {
  response.render('admin/index');
});

app.get('/admin/edit/:id', function(request, response) {
  console.log('=========================');
  console.log('params: ');
  console.dir(request.params);
  console.log('=========================');
  Portrait.get(request.params.id, function(portrait) {
    response.render('admin/edit', { portrait: portrait });
  });
});

app.post('/admin/update/:id', function(request, response) {
});

app.post('/admin/delete/:id', function(request, response) {
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
