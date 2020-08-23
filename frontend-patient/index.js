$(document).ready(function() {
    $('#showAll').click(getAll);
    $('#viewReport').submit(viewReport);
});

const getAll = function(event) {
    $.ajax({
        url: 'http://localhost:3003/all',
        method: 'GET',
        accepts: "application/json",
        success: function(data) {
            populateReports(JSON.parse(data));
        },
        error: function(error) {
            alert(JSON.stringify(error));
        }
    });
}

const populateReports = function(reports) {
    let plistString = '<ul id="allReportList">Allowed Reports';
    let addButton = "";
    reports.forEach(function(report) {
        reportInfo = '<li>Owner: ' + report.owner + '</li>';
        addButton = '<form method="POST" class="add"><input type="hidden" name="d_name" value="' + report.d_name +'"><input type="hidden" name="disease" value="' + report.disease + '"><input type="hidden" name="medicine" value="' + report.medicine + '"<button type="submit">Add</button></form>';
        plistString = plistString + '<li id="' + report.d_name + report.disease + report.medicine+ '">' + '<ul>' + report.d_name + ' ' + report.disease + ' '+ report.medicine + reportInfo + addButton + '</ul></li>';
    });
    plistString = plistString + '</ul>';

    $('#allReportDiv').html(plistString);
    $('.add').submit(addReport);
}

const putReport = function(report) {
    const reportInfo = '<li>Owner: ' + report.owner + '</li><li>Allowed: ' + report.allowed + '</li>';
    let addButton = '';
    const reportString = '<ul>' + report.d_name + ' ' + report.disease + ' ' + report.medicine + reportInfo + '</ul>';
    $('#viewreportdetails').html(reportString);
    console.log(report);
    if (report.allowed === false) {
        addButton = '<form method="POST" class="add"><input type="hidden" name="d_name" value="' + report.d_name +'"><input type="hidden" name="disease" value="' + report.disease + '"><input type="hidden" name="medicine" value="' + report.medicine + '"><button type="submit">Add</button></form>';
        $('#viewreportdetails').append(addButton);
        $('.add').submit(addReport);
    }
}

const addReport = function(event) {
    event.preventDefault();

    const formData = $(this).serializeArray();
    const d_nameString = formData[0].value;
    const diseaseString = formData[1].value;
    const medicineString = formData[2].value;

    $.ajax({
        url: 'http://localhost:3003/add',
        method: 'POST',
        accepts: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({
            d_name: d_nameString,
            disease: diseaseString,
            medicine: medicineString,
            newowner: "patient"
        }),
        success: function(data) {
            const prod = JSON.parse(data);
            const d_name = prod.d_name;
            const disease = prod.disease;

            $('#' + d_name + disease).remove();
            $('#viewreportdetails').empty();
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const viewReport = function(event) {
    event.preventDefault();

    const formData = $(this).serialize();
    $.ajax({
        url: 'http://localhost:3003/view?' + formData,
        method: 'GET',
        accepts: 'application/json',
        success: function(data) {
            putReport(JSON.parse(data));
        },
        error: function(error) {
            console.log(error);
        }
    });
}
