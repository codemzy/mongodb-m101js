var express = require('express'),
    app = express(),
    engines = require('consolidate');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.sendStatus(500);
    res.render('error_template', { error: err });
}

// our route has : so this part of the url is stored in a variable called name 
app.get('/:name', function(req, res, next) {
    var name = req.params.name;
    // these two lines show how to extract the get variables from the url
    var getvar1 = req.query.getvar1;
    var getvar2 = req.query.getvar2;
    // we render the result to the template
    res.render('hello', { name : name, getvar1 : getvar1, getvar2 : getvar2 });
});

app.use(errorHandler);

var server = app.listen(8080, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});