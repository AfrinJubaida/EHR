$(document).ready(function() {
    $('#showAll').click(getAll);
    $('#releaseReport').submit(releaseReport);
    $('#viewReport').submit(viewReport);
});

const getAll = function(event) {
    $.ajax({
        url: 'http://localhost:3002/all',
        method: 'GET',
        accepts: "application/json",
        success: function(data) {
            populateReports(data);
        },
        error: function(error) {
            alert(JSON.stringify(error));
        }
    });
}

const populateReports = function(reports) {
    let plistString = '<ul id="allReportsList">All Reports';
    reports.forEach(function(report) {
        reportInfo = '<li>Owner: ' + report.owner + '</li>';
        plistString = plistString + '<li id="' + report.d_name + report.disease + report.medicine + '">' + '<ul>' + report.d_name + ' ' + report.disease + ' ' + report.medicine + reportInfo + '</ul></li>';
    });
    plistString = plistString + '</ul>';

    $('#allReportsDiv').html(plistString);
}

const appendReport = function(report) {
    let plist = $('#allReportsList').html();
    const reportInfo = '<li>Owner: ' + report.owner + '</li>';
    let reportString = '<li id="' + report.d_name + report.disease + report.medicine + '">';
    reportString = reportString + '<ul>' + report.d_name + ' ' + report.disease + ' '+ report.medicine + reportInfo + '</ul></li>';
    $('#allReportsList').html(plist + reportString);
}

const releaseReport = function(event) {
    event.preventDefault();

    const formData = $('#releaseReport').serializeArray();
    const d_nameString = formData[0].value;
    const diseaseString = formData[1].value;
    const medicineString = formData[2].value;
    
    $.ajax({
        url: 'http://localhost:3002/release',
        method: 'POST',
        data: JSON.stringify({
            d_name: d_nameString,
            disease: diseaseString,
            medicine: medicineString
            
        }),
        contentType: 'application/json',
        success: function(data) {
            appendReport(JSON.parse(data));
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const putReport = function(report) {
    const reportInfo = '<li>Owner: ' + report.owner + '</li><li>Allowed: ' + report.allowed + '</li>';
    const reportString = '<ul>' + report.d_name + ' ' + report.disease + ' ' + report.medicine + reportInfo + '</ul>';
    $('#viewreportdetails').html(reportString);
}

const viewReport = function(event) {
    event.preventDefault();

    const formData = $(this).serialize();
    $.ajax({
        url: 'http://localhost:3002/view?' + formData,
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
