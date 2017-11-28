var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');
var cors = require('cors');

var pg = require("pg"); // This is the postgres database connection module.
//const connectionString = "postgres://postgres:Arsenal1!@localhost:5432/isotopedb";
const connectionString = "postgres://gpdqeokklqlkaw:55559494c7673658470f8e816cd8615ead67cff1ca62dc27b41ee4c2d4a3c239@ec2-107-21-205-25.compute-1.amazonaws.com:5432/dd8kbik4stv9se";
app.set('port', (process.env.PORT || 5000));

//static page setup
app.use(express.static(__dirname + '/public'));

//cors
app.use(cors())

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//listen for port
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


/************************************
* SERVICE ENDPOINT:
* Get list of isotopes from server database
*************************************/
app.get('/getIsotopes', function (request, response) {
    getIsotopes(request, response);
});

/************************************
* SERVICE ENDPOINT:
* Calculate Decayed Activity
*************************************/
app.get('/calculateDecay', function (request, response) {
    var requestUrl = url.parse(request.url, true);

    console.log("Query parameters: " + JSON.stringify(requestUrl.query));

    //isotope
    var isotope = String(requestUrl.query.isotope);

    //time
    var time = parseFloat(requestUrl.query.time);

    //calculate BMI
    var activity = parseFloat(requestUrl.query.activity);

    //half life
    var halfLife = assignHalfLife(isotope);

    //calculation
    var decayedActivity = findDecayedActivity(halfLife, activity, time) + " mCi";

    var params = { decayedActivity: decayedActivity };

    response.status(200).json(params);
});

//calculateDecay helper function
function assignHalfLife(isotope) {
    switch (isotope) {
        case "F-18":
            return halfLife = 1.83;
            break;
        case "Tc-99m":
            return halfLife = 6.05;
            break;
        case "I-131":
            return halfLife = 192.48;
            break;
        case "I-123":
            return halfLife = 13.22;
            break;
        default:
            alert("error");
    }
    return;
}

//calculateDecay helper function
function findDecayedActivity(halfLife, activity, time) {
    var stepZero = time * -0.693;
    var stepOne = stepZero / halfLife;
    var stepTwo = Math.exp(stepOne);
    var stepThree = activity * stepTwo;

    return stepThree.toFixed(2);
}

/************************************
* SERVICE ENDPOINT:
* Calculate BMI
*************************************/
app.get('/calculateBMI', function (request, response) {
    var requestUrl = url.parse(request.url, true);

    console.log("Query parameters: " + JSON.stringify(requestUrl.query));

    //weight
    var kgs = requestUrl.query.kgs;

    //height
    var feetInInches = requestUrl.query.feet * 12;

    var heightInInches = (+requestUrl.query.inches) + (+feetInInches);

    var heightInMeters = heightInInches.toFixed(2) * .0254;

    //calculate BMI
    var bmi = parseFloat((kgs / heightInMeters) / heightInMeters).toFixed(2);

    var params = { bmi: bmi };

    response.status(200).json(params);
});

/************************************
* SERVICE ENDPOINT:
* Calculate Pounds from given Kilos
*************************************/
app.get('/calculateKilos', function (request, response) {
    var requestUrl = url.parse(request.url, true);

    console.log("Query parameters: " + JSON.stringify(requestUrl.query));

    var kgs = requestUrl.query.kgs;

    var pounds = kgs * 2.2;

    var params = { pounds: pounds };

    response.status(200).json(params);
});

/*************************************
* GET ISOTOPES FUNCTION
**************************************/
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

/*************************************
* GET ISOTOPES FROM DB
* Create connection to database and then pull 
* values from the isotope table
**************************************/
function getIsotopesFromDB(callback) {
    console.log("Getting isotopes from DB");

    //create new client object with connection string
    var client = new pg.Client(connectionString);

    //connect to server DB
    client.connect(function (err) {
        if (err) {
            console.log("Error connecting to DB: ")
            console.log(err);
            callback(err, null);
        }

        //get everything from table
        var sql = "SELECT * FROM isotope";

        //query string
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