var express = require('express'),
    app = express();

// the route for the homepage '/'
app.get('/', function(req, res){
    res.send('Hello World');
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