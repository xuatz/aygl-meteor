

checkIfPlayerReportedResult = function(resultReports, username) {
	var resultReport = _.find(resultReports, function(item){
		if (item) {
			return item.username === username;
		}
	});

	if (!resultReport) {
		return false;
	} else {
		if (resultReport.result) {
			return true;
		} else {
			return false;
		}
	}
}