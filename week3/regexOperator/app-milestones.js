var MongoClient = require('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'), 
    assert = require('assert');


var options = commandLineOptions();


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");
    
    var query = queryDocument(options);
    var projection = projectionDocument(options);

    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    
    var numMatches = 0;

    cursor.forEach(
        function(doc) {
            numMatches = numMatches + 1;
            console.log( doc );
        },
        function(err) {
            assert.equal(err, null);
            console.log("Our query was:" + JSON.stringify(query));
            console.log("Matching documents: " + numMatches);
            return db.close();
        }
    );

});


function queryDocument(options) {

    console.log(options);
    
    var query = {};

    // can specify overview (optional)
    if ("overview" in options) {
        query.overview = {"$regex": options.overview, "$options": "i"};
    }
    // can specify milestones (optional) need to use brackets not dot as dot notation to get field
    if ("milestones" in options) {
        query["milestones.source_description"] =
            {"$regex": options.milestones, "$options": "i"};
    }

    return query;
    
}


function projectionDocument(options) {

    var projection = {
        "_id": 0,
        "name": 1,
        "founded_year": 1
    };

    // include overview field if the overview has been passed in as an option
    if ("overview" in options) {
        projection.overview = 1;
    }
    // include milestones field if the milestones has been passed in as an option
    if ("milestones" in options) {
        projection["milestones.source_description"] = 1;
    }

    return projection;
}


function commandLineOptions() {

    var cli = commandLineArgs([
        { name: "overview", alias: "o", type: String },
        { name: "milestones", alias: "m", type: String }
    ]);
    
    var options = cli.parse()
    if (Object.keys(options).length < 1) {
        console.log(cli.getUsage({
            title: "Usage",
            description: "You must supply at least one option. See below."
        }));
        process.exit();
    }

    return options;
    
}


