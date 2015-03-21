


var matches = [
				{	
					"status" : "PU", 
					"result" : "D",
					"admin" : "moltencrap",
					"screenshotUrl" : "www.niceurl.com/huatah",
					"matchPlayerResultArr" : [
						{
						"username" : "player1",
						"player_slot" : "0",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player2",
						"player_slot" : "1",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player3",
						"player_slot" : "2",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player4",
						"player_slot" : "3",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player5",
						"player_slot" : "4",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player6",
						"player_slot" : "5",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player7",
						"player_slot" : "6",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player8",
						"player_slot" : "7",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player9",
						"player_slot" : "8",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player10",
						"player_slot" : "9",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						}
					]
				}
			];



Meteor.methods({
	demoMatchDetailsMethod: function(err) {
		var m = MatchesCollection.findOne();

		console.log(m);

		return m;
	}
});

var checkMatchResultReports = function (gameId) {
	console.log('Start of checkMatchResultReports');
	console.log('Oh my im triggered thx to reactivity.');

	// TODO 
	// var game = Games.findOne({
	// 	'gameId' : gameId
	// });
	
	/*
	if (game.scoreReports.size() > 0) {
		//TODO 
		// if (!Game.matchScoreReportedDttm) {
		// 	Game.matchScoreReportedDttm = new Date();
		// }

		//TODO - hardcoded for dev
		boolean cptRadReportedScore = true;
		boolean cptDireReportedScore = true;

		if (cptRadReportedScore && cptDireReportedScore) {
			if (bothCptSameResult) {
				if (void) {
					//TODO delete match
					console.log('Match deleted(Void)');
				} else {
					//MatchDetails.result = R/D
					//TODO send matchDetails to banana!!!
					console.log('Match processing!');
				}
			} else {
				//TODO
				//MatchDetails.result = 'I';

				console.log('Match pending investigation!');
			}
		} else {
			//The point is that, we will in general, use the cpt report as absolute
			//hence we give a 3 hours grace peroid starting from first match report timing
			if (afterThreeHours) {
				//after 3 hours, we will take the party member reports into consideration

				if (game.scoreReports.size()>5) {
					//TODO get most popular decision count

					if (mostPopularDecisionCount > game.scoreReports.size()/2) {
						if (void) {
							//TODO delete match

							console.log('Match deleted(Void)');
						} else {
							//MatchDetails.result = R/D
							//TODO send matchDetails to banana!!!

							console.log('Match processing!');
						}
					} else {
						//TODO
						//MatchDetails.result = 'I';

						console.log('Match pending investigation!');
					}
				}
			}
		}
	}

	*/

	console.log('Still waiting for more score reports from players...');
}

//XZ:21/3/15
var handle = Tracker.autorun(function () {
	var gameId;
	checkMatchResultReports(gameId);
});

