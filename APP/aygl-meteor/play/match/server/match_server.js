var crypto = Npm.require('crypto');

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
		//console.log(item);
		return true;
	} else {
		return false;
	}
};

var checkMatchResultReports = function(gameId) {
	console.log('Start of checkMatchResultReports');

	var g = Games.findOne({});
	//var g = Games.findOne({'_id': gameId});

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
				);

				//TODO insert code to run this method again after 3 hours for section Z

				console.log('check if the local object is updated');
				console.log('g.matchScoreReportedDttm: ' + g.matchScoreReportedDttm);
				console.log(g.matchScoreReportedDttm);

				console.log('im fetching the game again from db, compare the value with above!');
				g = Games.findOne({});
				//g = Games.findOne({'_id': gameId});
				console.log('scoreReportedDttm: ' + g.matchScoreReportedDttm);

			} else {
				//TODO DT: note: upon draft completion, a matchDetails will be created liao, with the games._id as FK
				var m = MatchesCollection.findOne({'gameId': g._id});
				//we fetch latest before taking action cos maybe some1 else's action already resolved this game

				if (m.result) {
					//since the matchDetails already have a result liao, dun need to do anything liao
				} else {
					var cptRadScoreReport = _.find(g.scoreReports, function(item){
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

							var reasonableTimeElapsedSinceMatchLobbyCreated = true;
							var matchDetailsCreatedDttm = moment(matchDetails.createdDttm);
							var durationSinceCreation = moment.duration(moment().diff(matchDetailsCreatedDttm));

							if (duration.minutes() > 10) {
								reasonableTimeElapsedSinceMatchLobbyCreated = true;
							} else {
								reasonableTimeElapsedSinceMatchLobbyCreated = false;
							}

							takeActionOnMatchDetailsBasedOnResult(m, cptRadScoreReport.result, reasonableTimeElapsedSinceMatchLobbyCreated);
						} else {
							updateMatchDetailsResultAsInvestigation(m);
						}
					} else {
						//The point is that, we will in general, use the cpt report as absolute
						//hence we give a 3 hours grace peroid starting from first match report timing

						console.log('scoreReportedDttm: ' + g.matchScoreReportedDttm);

						var reportDttm = moment(g.matchScoreReportedDttm);
						var duration = moment.duration(moment().diff(reportDttm));

						//console.log(duration);
						console.log(duration.minutes());
						console.log(duration.hours());

						//TODO section Z
						if (duration.hours() >= 3) {
							//after 3 hours, we will take the party member reports into consideration

							if (g.scoreReports.size()>0) {
								var topResult = getMostPopularResult(g);

								if (topResult) {
									takeActionOnMatchDetailsBasedOnResult(matchDetails, topResult, true);
								} else {
									updateMatchDetailsResultAsInvestigation(m);
								}
							}
						}
					}
				}
			}
		}

		//console.log('Still waiting for more score reports from players...');
	}
	sendMatchDetailsToBanana();
}

var getMostPopularResult = function(game) {
	var countV = 0;
	var countR = 0;
	var countD = 0;

	_.each(game.scoreReports, function(item) {
		if(item !== null) {
			switch (item.result) {
				case 'V':
					countV++;
					break;
				case 'R':
					countR++;
					break;
				case 'D':
					countD++;
					break;
			}
		}
	});

	var counts = [
		{result: 'V',
		count: countV},
		{result: 'R',
		count: countR},
		{result: 'D',
		count: countD}
	];

	counts = _.sortBy(counts, function(item) {
			return item.count;
	});

	console.log('hi im checking the content of getMostPopularResult()');

	if (counts[1] == count[2]) {
		return null;
	} else {
		return count[2].result;
	}
}

Meteor.methods({
	updatePlayerScoreReport: function(gameId, username, playerSlot, result) {
				//TODO demo for dev purpose only
        var g = Games.findOne({});
        var gameId = g._id;

				//================

        //we need to upsert a the match report into game item for current player (client)
        var fieldString = 'scoreReports.' + playerSlot;

        var obj = {};
        obj[fieldString] =
        {
            'username': username,
            'playerSlot': playerSlot,
            'result': result
        };

        Games.upsert(
            { _id : gameId },
            {
                $set: obj
            }
        );

				checkMatchResultReports(gameId);
	}
});

var updateMatchDetailsResultAsInvestigation = function(matchDetails) {
	console.log('Match pending investigation!');
	//TODO XZ: implement CommonConstants
	MatchesCollection.update(
		{
			_id : matchDetails._id
		},
		{
			result : 'I'
		}
	);
}

var takeActionOnMatchDetailsBasedOnResult = function(matchDetails, result, reasonableTimeElapsedSinceMatchLobbyCreated) {
	switch (result) {
		case 'V':
			//TODO delete match
			console.log('Match deleted(Void)');
			break;
		case 'R':
		case 'D':
			if (reasonableTimeElapsedSinceMatchLobbyCreated) {
				//TODO MatchDetails.result = cptRadScoreReport.result
				//TODO send matchDetails to banana!!!
				console.log('Match processing!');
			} else {
				//TODO set result as I
				//potentially some1 is abusing the system
				//i.e. both cpt just spam DIRE win without any games played to boost result
				matchDetails.result = 'I';
				console.log('Match pending investigation!');
			}
			break;
	}
}

var sendMatchDetailsToBanana = function() {
	console.log('demo send stuff to banana');

	var match = MatchesCollection.findOne();
	var matchString = JSON.stringify(match);

	var password = '/match' + matchString;
	// console.log('password');
	// console.log(password);

    var salt = "byvGX7KLa4";
    var iterations = 2;
    var keylen = 128;

    var hash = crypto.pbkdf2Sync(password, salt, iterations, keylen).toString('base64');

    // console.log(hash);
    // console.log('==================');

    HTTP.call("POST", "http://localhost:3000/match",
        {
            headers: {
                authorization: "aygldb " + hash
            }
            , params: {matchDetails: matchString}
        }, function(err, res) {
            if (res) {
                // console.log('huatah');
                // console.log('==================');
                // console.log(res);
                return res;
            }
        }
    );
}
