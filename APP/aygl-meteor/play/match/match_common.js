

checkIfPlayerReportedResult = function(resultReports, username) {
	// console.log('huatah');
	// console.log(resultReports);
	// console.log(username);

	var resultReport = _.find(resultReports, function(item){
		if (item) {
			// console.log(item);
			// console.log(item.username);
			// console.log(username);
			return item.username === username;
		}
	});

	if (!resultReport) {
		// console.log('false');
		return false;
	} else {
		if (resultReport.result) {
			// console.log('true');
			return true;
		} else {
			// console.log('false');
			return false;
		}
	}
}