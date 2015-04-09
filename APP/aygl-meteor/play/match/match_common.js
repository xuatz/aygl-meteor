checkIfPlayerReportedScore = function(scoreReports, username) {
	console.log('huatah');
	console.log(scoreReports);
	console.log(username);

	var scoreReport = _.find(scoreReports, function(item){
		if (item) {
			console.log(item);
			console.log(item.username);
			console.log(username);

			return item.username === username;
		}
	});

	if (!scoreReport) {
		console.log('false');
		return false;
	} else {
		if (scoreReport.result) {
			console.log('true');
			return true;
		} else {
			console.log('false');
			return false;
		}
	}
}