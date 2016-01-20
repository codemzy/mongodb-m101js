var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");
    
    var query = {"permalink": {"$exists": true, "$ne": null}};
    var projection = {"permalink": 1, "updated_at": 1};

    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    // sort so duplicate entries appear next to each other
    cursor.sort({"permalink": 1})

    // so we can count the number to remove
    var numToRemove = 0;

    var previous = { "permalink": "", "updated_at": "" };
    cursor.forEach(
        function(doc) {

            if ( (doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at) ) {
                console.log(doc.permalink);
                
                // add one to the count of the number to be removed
                numToRemove = numToRemove + 1;

                var filter = {"_id": doc._id};

                db.collection('companies').deleteOne(filter, function(err, res) {

                    assert.equal(err, null);
                    console.log(res.result);

                });

            }
            
            // update previous so the next one will be the one we have finished processing
            previous = doc;
            
        },
        function(err) {

            assert.equal(err, null);

        }
    );

});


