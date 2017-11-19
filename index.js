var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');

var pg = require("pg"); // This is the postgres database connection module.
//const connectionString = "postgres://postgres:Arsenal1!@localhost:5432/tickets";
const connectionString = "postgres://gpdqeokklqlkaw:55559494c7673658470f8e816cd8615ead67cff1ca62dc27b41ee4c2d4a3c239@ec2-107-21-205-25.compute-1.amazonaws.com:5432/dd8kbik4stv9se";
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getIsotopes', function (request, response) {
    getIsotopes(request, response);

});

app.get('/calculateKilos', function (request, response){
    var requestUrl = url.parse(request.url, true);
    
    console.log("Query parameters: " + JSON.stringify(requestUrl.query));

    var kgs = requestUrl.query.kgs;

    var pounds = calculateKilos(kgs);

    var params = { pounds: pounds };

    response.status(200).json(params);
});

function calculateKilos(pounds) {
    return pounds * 2.2;
}

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

function getIsotopes(request, response) {

    getIsotopesFromDB(function (error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            var test = result;
            response.status(200).json(result);
        }
    });
}

function getIsotopesFromDB(callback) {
    console.log("Getting isotopes from DB");

    var client = new pg.Client(connectionString);

    client.connect(function (err) {
        if (err) {
            console.log("Error connecting to DB: ")
            console.log(err);
            callback(err, null);
        }

        var sql = "SELECT * FROM isotope";

        var query = client.query(sql, function (err, result) {
            // we are now done getting the data from the DB, disconnect the client
            client.end(function (err) {
                if (err) throw err;
            });

            if (err) {
                console.log("Error in query: ")
                console.log(err);
                callback(err, null);
            }

            console.log("Found result: " + JSON.stringify(result.rows));

            // call whatever function the person that called us wanted, giving it
            // the results that we have been compiling
            callback(null, result.rows);
        });
    });
}