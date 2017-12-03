$(document).ready(function () {
    $.get("/getIsotopes", function (result) {

        var html = '';
        for (var i = 0; i < result.length; i++) {
            html += '<tr><td>' + result[i].name +
                '</td><td>' + result[i].halflife +
                '</td><td>' + result[i].decaytype +
                '</td><td>' + result[i].gammaenergy +
                '</tr>';
        }

        $('#isotopeTable tr').first().after(html);
    });
});

function calculateKilos() {
    var kgs = document.getElementById('kilosinput').value;

    $.get("/calculateKilos?kgs=" + kgs, function (result) {
        document.getElementById('lbsoutput').value = Math.round(result.pounds);
    });
}

function calculatePounds() {
    var pounds = document.getElementById('lbsoutput').value;

    $.get("calculatePounds?pounds=" + pounds, function (result) {
        document.getElementById('kilosinput').value = Math.round(result.kgs);
    })
}

function calculateDecay() {
    var selectedIsotope = document.getElementById("isoID");
    var isotope = selectedIsotope.options[selectedIsotope.selectedIndex].value;
    var timePassed = document.getElementById("timePassed").value;
    var currentActivity = document.getElementById("currentActivity").value;

    $.get("/calculateDecay?isotope=" + isotope + "&time=" + timePassed + "&activity=" + currentActivity,
        function (result) {
            document.getElementById("decayResult").value = result.decayedActivity;
        })
}

function calculateBMI() {

    var kgs = document.getElementById('weightKilos').value;
    var feet = document.getElementById('heightFeet').value;
    var inches = document.getElementById('heightInches').value;

    $.get("/calculateBMI?kgs=" + kgs + "&feet=" + feet + "&inches=" + inches, function (result) {
        document.getElementById('bmiResult').value = result.bmi;
    })
}

function searchMedline() {
    var userInput = $('#medicalCondition').val();
    var finalInput = userInput.replace(" ", "+");

    $.ajax({
        type: 'GET',
        url: '/_search?q=' + finalInput,
        dataType: 'json',
        success: function (data) {
            var results = "";

            //shuffle through all the xml to get just the snippet tag and 
            //information contained within
            if (data.nlmSearchResult.list != null) {
                var document = data.nlmSearchResult.list[0].document[0];

                for (var i = 0; i < document.content.length; i++) {
                    if (document.content[i].$.name === "snippet") {
                        results = document.content[i]._;
                    }
                }
            }
            else {
                results = "No Results...";
            }
            $('#conditionResult').html("<br><p>" + results + "</p>");
        }
    });
}