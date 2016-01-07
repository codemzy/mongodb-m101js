var express = require('express'),
    app = express(),
    engines = require('consolidate');

// first register nunjucks as our template engine associated with the html extenstion  
app.engine('html', engines.nunjucks);
// set the view engine app setting to html, were going to use this engine to render our html files
app.set('view engine', 'html');
// specify where our templates are located
app.set('views', __dirname + '/views');

// the route for the homepage '/'
app.get('/', function(req, res){
    // render the template we have created in the views folder hello.html
    res.render('hello', { 'name' : 'Templates'});
});

// handle other routes using use to handle anything not routed above
app.use(function(req, res){
    res.sendStatus(404); 
});

// listen for client connections
var server = app.listen(8080, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
});