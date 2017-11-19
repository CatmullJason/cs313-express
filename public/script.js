$(document).ready( function(){
    $.get("/getIsotopes", function (result) {

        var html = '';
        for (var i = 0; i < result.length; i++)
        {
            html += '<tr><td>' + result[i].name + 
            '</td><td>' + result[i].halflife + '</td></tr>';
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