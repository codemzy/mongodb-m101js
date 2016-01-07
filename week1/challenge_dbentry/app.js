var express = require('express')
  , app = express()
  , cons = require('consolidate')
  , MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var bodyParser = require('body-parser');

app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect to the MongoDB database
MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
    
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    // Handler for internal server errors
    function errorHandler(err, req, res, next) {
        console.error(err.message);
        console.error(err.stack);
        res.status(500);
        res.render('error_template', { error: err.message });
    }

    app.use(errorHandler);

    // this is our first route which shows the form to pcik a fruit
    app.get('/', function(req, res, next) {
        res.render('addMovie', { 'fields' : [ 'Film Name', 'Year', 'IMDB' ] });
    });

    // this is where we handle the form submission
    app.post('/add_movie', function(req, res, next) {
        var filmname = req.body["Film Name"];
        var year = req.body["Year"];
        var imdb = req.body["IMDB"];
        if (typeof filmname == 'undefined') {
            next(Error('Please choose a movie!'));
        }
        else {
            db.collection('movies').find({}).toArray(function(err, docs) {
                res.render('movies', { 'movies': docs } );
            });
            console.log(year);
        }
    });

    app.listen(8080);
    console.log('Express server listening on port 8080');

});