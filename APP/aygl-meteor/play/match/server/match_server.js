
// var matches = [
// 				{	
// 					"status" : "PU", 
// 					"result" : "D",
// 					"admin" : "moltencrap",
// 					"screenshotUrl" : "www.niceurl.com/huatah",
// 					"matchPlayerResultArr" : [
// 						{
// 						"username" : "player1",
// 						"player_slot" : "0",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player2",
// 						"player_slot" : "1",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player3",
// 						"player_slot" : "2",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player4",
// 						"player_slot" : "3",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player5",
// 						"player_slot" : "4",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player6",
// 						"player_slot" : "5",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player7",
// 						"player_slot" : "6",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player8",
// 						"player_slot" : "7",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player9",
// 						"player_slot" : "8",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						},
// 						{
// 						"username" : "player10",
// 						"player_slot" : "9",
// 						"minScore" : "1000",
// 						"maxScore" : "3000",
// 						"score" : "2000"
// 						}
// 					]
// 				}
// 			];

function checkIfCptReportedScore(g, side) {
	switch (side) {
		case 'R':
			var item = _.find(g.scoreReports, function(item){
				if (item !== null) {
					return item.playerSlot == 0;
				}
			});
			break;
		case 'D':
			var item = _.find(g.scoreReports, function(item){
				if (item !== null) {
					return item.playerSlot == 5;	
				}
			});
			break;
	}

	if (item) {
		return true;
	} else {
		return false;
	}
};

Meteor.methods({
	demoMatchDetailsMethod: function(err) {
		var m = MatchesCollection.findOne();

		console.log(m);

		return m;
	},
	updatePlayerScoreReport: function(gameId, username, playerSlot, result) {
      	//TODO demo for dev purpose only
        var g = Games.findOne({});

        var gameId = g._id;

        //2) we need to upsert a the match report into game item for current player (client)
        var fieldString = 'scoreReports.' + playerSlot; 

        var obj = {};
        obj[fieldString] = 
        {  
            'username': username,
            'playerSlot': playerSlot,
            'result': result 
        };

        //functional code, but wait till i have the data den i enable it
        Games.upsert(
            { _id : gameId },
            {
                $set: obj
            }
        );
	},
	checkMatchResultReports: function(gameId) {
		console.log('Start of checkMatchResultReports');

		var g = Games.findOne({});

		if (!g) {
			console.log('game no found, perhaps its already processed?');
		} else {
			if (!g.scoreReports) {
				g.scoreReports = [];
			}
			
			// g.scoreReports[0] = {
			// 	'username': 'moltencrap',
			// 	'playerSlot': '0',
			// 	'result': 'V'
			// };

			console.log(g);
			console.log('==========');
			
			//=======================

			// var gameId = g._id;
			// var obj = {};
			// var index = 4;
			// var field = 'scoreReports.' + index; 
			// obj[field] = {  'username': 'kokoro',
			// 				'playerSlot': '4',
			// 				'result': 'TEST' };
			// Games.upsert(
			// 	{ _id : gameId },
			// 	{
			// 		$set: obj
			// 	}
			// );

			// //=======================

			// g = Games.findOne({});
			// console.log(g);
			// console.log('==========');
			
			var count = 0;
			_.each(g.scoreReports, function(item) {
				if(item !== null) {
					count++;
				}
			});

			console.log('count: ' + count);

			if (count > 0) {
				if (!g.matchScoreReportedDttm) {
					Games.update(
						{ _id : g._id },
						{
							$set: {
								'matchScoreReportedDttm': new Date
							}
						}
					)

					//TODO insert code to run this method again after 3 hours for section Z

					g = Games.findOne({});
					console.log('scoreReportedDttm: ' + g.matchScoreReportedDttm);
				} else {
					//TODO check if MatchDetails have a result, if yes den do nothing liao
					var hasResult = false;

					if (hasResult) {
						//pangpang lo
					} else {
						var cptRadScoreReport = 

						_.find(g.scoreReports, function(item){
							if (item) {
								return item.playerSlot == 0;
							}
						});
						var cptDireScoreReport = _.find(g.scoreReports, function(item){
													if (item) {
														return item.playerSlot == 5;
													}
												});

						console.log('cptRadReportedScore: ' + cptRadScoreReport);
						console.log('cptDireReportedScore: ' + cptDireScoreReport);

						if (cptRadScoreReport && cptDireScoreReport) {
							if (cptRadScoreReport.result == cptDireScoreReport.result) {
								switch (cptRadScoreReport.result) {
									case 'V':
										//TODO delete match
										console.log('Match deleted(Void)');
										break;
									case 'R':
									case 'D':
										//TODO MatchDetails.result = cptRadScoreReport.result
										//TODO send matchDetails to banana!!!
										console.log('Match processing!');
										break;
								}
							} else {
								//TODO
								//MatchDetails.result = 'I';
								console.log('Match pending investigation!');
							}
						} else {
							//The point is that, we will in general, use the cpt report as absolute
							//hence we give a 3 hours grace peroid starting from first match report timing

							console.log('scoreReportedDttm: ' + g.matchScoreReportedDttm);

							//TOOD *WIP*

							var timeSince = moment(g.matchScoreReportedDttm).fromNow(true);
							
							var reportDttm = moment(g.matchScoreReportedDttm);

							var duration = moment.duration(moment().diff(reportDttm));

							//console.log(duration);
							console.log(duration.minutes());
							console.log(duration.hours());

							//TODO section Z
						// 	if (afterThreeHours) {
						// 		//after 3 hours, we will take the party member reports into consideration

						// 		if (game.scoreReports.size()>5) {
						// 			//TODO get most popular decision count

						// 			if (mostPopularDecisionCount > game.scoreReports.size()/2) {
						// 				if (void) {
						// 					//TODO delete match

						// 					console.log('Match deleted(Void)');
						// 				} else {
						// 					//MatchDetails.result = R/D
						// 					//TODO send matchDetails to banana!!!

						// 					console.log('Match processing!');
						// 				}
						// 			} else {
						// 				//TODO
						// 				//MatchDetails.result = 'I';

						// 				console.log('Match pending investigation!');
						// 			}
						// 		}
						// 	}
						}
					}
				}
			}
		}

		console.log('Still waiting for more score reports from players...');
	}
});

