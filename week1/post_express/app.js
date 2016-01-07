var express = require('express')
  , app = express()
  , cons = require('consolidate');
  
var bodyParser = require('body-parser');

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(app.router);

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
    res.render('fruitPicker', { 'fruits' : [ 'apple', 'orange', 'banana', 'peach' ] });
});

// this is where we handle the form submission
app.post('/favorite_fruit', function(req, res, next) {
    var favorite = req.body.fruit;
    if (typeof favorite == 'undefined') {
        next(Error('Please choose a fruit!'));
    }
    else {
        res.send("Your favorite fruit is " + favorite);
    }
});

app.listen(8080);
console.log('Express server listening on port 8080');