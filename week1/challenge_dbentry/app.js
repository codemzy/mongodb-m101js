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

    // this is our first route which shows the form to add a movie
    app.get('/', function(req, res, next) {
        res.render('addMovie', { 'fields' : [ 'Film Name', 'Year', 'IMDB' ] });
    });
    
    // this is another route which shows the list of all the movies
    app.get('/movies', function(req, res){
        // render the template we have created in the views folder movies.html
        // with data recieved from the data base included
        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('movies', { 'movies': docs } );
        });
    });

    // this is where we handle the form submission
    app.post('/add_movie', function(req, res, next) {
        var filmname = req.body["Film Name"];
        var year = req.body["Year"];
        var imdb = req.body["IMDB"];
        if (typeof filmname == 'undefined') {
            next(Error('Please include a film name!'));
        }
        else if (typeof year == 'undefined') {
            next(Error('Please include a year!'));
        }
        else if (typeof imdb == 'undefined') {
            next(Error('Please include the IMDB reference!'));
        }
        else {
            db.collection('movies').insert( { "title" : filmname, "year" : year, "imdv" : imdb } );
            console.log("The movie " + filmname + " has been added to the database")
            res.render('confirmation_template', { 'filmname': filmname } );
        }
    });

    app.listen(8080);
    console.log('Express server listening on port 8080');

});