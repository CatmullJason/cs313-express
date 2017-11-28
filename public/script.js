$(document).ready(function () {
    $.get("/getIsotopes", function (result) {

        var html = '';
        for (var i = 0; i < result.length; i++) {
            html += '<tr><td>' + result[i].name +
                '</td><td>' + result[i].halflife + ' minutes</td></tr>';
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

    $.get("/calculateBMI?kgs=" + kgs + "&feet=" + feet + "&inches=" + inches, function(result) {
        document.getElementById('bmiResult').value = result.bmi;
    })
}

function searchMedline() {
    var userInput = $('#medicalCondition').val();
    $.ajax({
        type: 'GET',
        url: "https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=" + userInput,

        dataType: "jsonp",
        jsonp: true,
        crossDomain: true,
        withCredentials: true,
        success: function (responseData, textStatus, jqXHR) {

            alert("success");

        },
        error: function (responseData, textStatus, errorThrown) {
            alert('POST failed.');
        }
    });


}