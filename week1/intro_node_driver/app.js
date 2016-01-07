var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// here we connect to the video database
var url = 'mongodb://localhost:27017/video';

// call back function handles the result of the connection
MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to server");

    // Find some documents in our collection
    // Find returns a cursor, so toArray converts this to an array
    db.collection('movies').find({}).toArray(function(err, docs) {

        // Print the documents returned
        docs.forEach(function(doc) {
            console.log(doc.title);
        });

        // Close the DB
        db.close();
    });

    // Declare success
    console.log("Called find()");
});