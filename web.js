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
    mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

      db.addListener("error", function(error) {
        console.log("Error connecting to MongoLab");
      });

      db.collection("selfportraits", function(error, collection) {
        collection.find({ 'id': id }, function(error, cursor) {
          cursor.nextObject(function(error, doc) {
            callback(doc || {});
          });
        });
      });

    });
  },

  all: function(callback) {
    mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

      db.addListener("error", function(error) {
        console.log("Error connecting to MongoLab");
      });

      db.collection("selfportraits", function(error, collection) {
        collection.find({}, { 'sort': 'filename' }, function(error, cursor) {
          cursor.toArray(function(error, docs) {
            callback(docs);
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
          for(var i in files) {
            collection.insert({ 'filename': files[i], 'id': files[i].replace(/\.\w*$/,'').replace(/\s/g, '-') });
          }
        });
      });
    });
  });

});

app.get('/', function(request, response) {
  Portrait.all(function(portraits) {
    response.render('index', { 'portraits': portraits });
  });
});

app.get('/portraits/all', function(request, response) {
  Portrait.all(function(portraits) {
    response.send(portraits);
  });
});

app.get('/portraits/:id', function(request, response) {
  Portrait.get(request.params.id, function(portrait) {
    response.send(JSON.stringify(portrait));
  });
});

app.get('/admin', function(request, response) {
  response.render('admin/index');
});

app.get('/admin/edit/:id', function(request, response) {
  Portrait.get(request.params.id, function(portrait) {
    response.render('admin/edit', { 'portrait': portrait });
  });
});

app.post('/admin/update/:id', function(request, response) {
  mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {

    db.addListener("error", function(error) {
      console.log("Error connecting to MongoLab");
    });

    db.collection("selfportraits", function(error, collection) {
      collection.update(
        { 'id': request.params.id }, 
        { 
          '$set': {
           'title': request.body.portrait.title,
           'center_top': request.body.portrait.center_top,
           'center_left': request.body.portrait.center_left
          }
        }, 
        { 'safe': true }, 
        function(error) {
          // probably a better way to avoid hitting the db so many times
          Portrait.get(request.params.id, function(portrait) {
            response.render('admin/edit', { 'portrait': portrait, 'updated': !error });
          });
        }
      );
    });

  }); 
});

app.post('/admin/delete/:id', function(request, response) {
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
