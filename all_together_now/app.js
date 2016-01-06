// all the dependencies we looked at in the previous lessons
var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// first register nunjucks as our template engine associated with the html extenstion  
app.engine('html', engines.nunjucks);
// set the view engine app setting to html, were going to use this engine to render our html files
app.set('view engine', 'html');
// specify where our templates are located
app.set('views', __dirname + '/views');

// connect to the MongoDB database
MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    // the route for the homepage '/'
    app.get('/', function(req, res){
        // render the template we have created in the views folder movies.html
        // with data recieved from the data base included
        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('movies', { 'movies': docs } );
        });

    });

    // handle other routes using use to handle anything not routed above
    app.use(function(req, res){
        res.sendStatus(404);
    });
    
    // listen for client connections
    var server = app.listen(8080, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});