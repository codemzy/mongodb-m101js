// require the mongo client and have it installed (npm install mongodb)
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// connect to the database
MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    // our query
    var query = {"category_code": "biotech"};

    // run the find command with our query
    db.collection('companies').find(query).toArray(function(err, docs) {

        assert.equal(err, null);
        assert.notEqual(docs.length, 0);
        
        // loop through array object (docs) and printing out each company and the category
        docs.forEach(function(doc) {
            console.log( doc.name + " is a " + doc.category_code + " company." );
        });
        
        db.close();
        
    });

});
