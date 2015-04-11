var crypto = Npm.require('crypto')
	,Future = Npm.require('fibers/future');

Meteor.methods({
	updatePlayerResultReport: function(gameId, username, playerSlot, result) {
		console.log('check env var');
        console.log(process.env.HASH_SALT);

		//TODO demo for dev purpose only
        var g = Games.findOne({});
        var gameId = g._id;

		//================

        //we need to upsert a the match report into game item for current player (client)
        var fieldString = 'resultReports.' + playerSlot;

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
	},
	sendMatchDetailsToMainDB: function(matchDetailsId) {
		console.log('sendMatchDetailsToMainDB');

		//hardcoded for dev
		var matchDetails = MatchesCollection.findOne();
		// var matchDetails = MatchesCollection.findOne({
		// 	_id : matchDetailsId
		// });

		var matchString = JSON.stringify(matchDetails);
		//var matchString = JSON.stringify(matchDetails);

		var password = '/match' + matchString;
		// console.log('==================');
		// console.log('password');
		// console.log(password);

		var salt = process.env.HASH_SALT;
		var iterations = parseInt(process.env.HASH_ITERATIONS);
		var keylen = parseInt(process.env.HASH_KEYLEN);

	    var hash = crypto.pbkdf2Sync(password, salt, iterations, keylen).toString('base64');

	    // console.log('==================');
	    // console.log(hash);
	    
	    var fut = new Future();

	    HTTP.call("POST", "http://localhost:3000/match",
	        {
	            headers: {
	                authorization: "aygldb " + hash
	            }
	            , params: {matchDetails: matchString}
	        }, function(err, res) {
	        	if (err) {
	        		console.log('==================');
	        		console.log('there is an error');
	        		console.log(err);

	        		//TODO log error somewhere???

	        		fut.throw(err);
	        	}
	        	if (res) {
	        		console.log('==================');
	        		console.log('there is an res');
	        		console.log(res);
	        		console.log('==================');
	        		console.log(res.content);	        		

	        		if (res.statusCode === 201) {
	        			//its a success!
	        			//TODO delete corresponding matchDetails and Game
	                } else {
	                	//if fail
	                	MatchesCollection.update(
							{
								_id : matchDetails._id
							},
							{
								status : 'PU'
							}
						);
	                	//TODO log error somewhere???
	                }

	                fut.return(res.statusCode);
	            }
	        }
	    );

	    return fut.wait();
	}
});

//======================================

var checkMatchResultReports = function(gameId) {
	console.log('Start of checkMatchResultReports');

	var g = Games.findOne({});
	//var g = Games.findOne({'_id': gameId});

	if (!g) {
		console.log('game no found, perhaps its already processed?');
	} else {
		if (!g.resultReports) {
			g.resultReports = [];
		}

		console.log(g);
		console.log('==========');

		//=======================

		// var gameId = g._id;
		// var obj = {};
		// var index = 4;
		// var field = 'resultReports.' + index;
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
		_.each(g.resultReports, function(item) {
			if(item !== null) {
				count++;
			}
		});

		console.log('count: ' + count);

		if (count > 0) {
			if (!g.matchResultReportedDttm) {
				Games.update(
					{ _id : g._id },
					{
						$set: {
							'matchResultReportedDttm': new Date
						}
					}
				);

				//TODO insert code to run this method again after 3 hours for section Z

				console.log('check if the local object is updated');
				console.log('g.matchResultReportedDttm: ' + g.matchResultReportedDttm);
				console.log(g.matchResultReportedDttm);

				console.log('im fetching the game again from db, compare the value with above!');
				g = Games.findOne({});
				//g = Games.findOne({'_id': gameId});
				console.log('resultReportedDttm: ' + g.matchResultReportedDttm);

			} else {
				//TODO DT: note: upon draft completion, a matchDetails will be created liao, with the games._id as FK
				var m = MatchesCollection.findOne({'gameId': g._id});
				//we fetch latest before taking action cos maybe some1 else's action already resolved this game

				if (!m) {
					console.log('There is a big problem, why is there no matchDetails?');
				} else {
					if (m.result) {
						//since the matchDetails already have a result liao, dun need to do anything liao
					} else {
						
						
						var cptRadResultReport = _.find(g.resultReports, function(item){
													if (item) {
														return item.playerSlot == 0;
													}
												});
						var cptDireResultReport = _.find(g.resultReports, function(item){
													if (item) {
														return item.playerSlot == 5;
													}
												});

						console.log('cptRadReportedResult: ' + cptRadResultReport);
						console.log('cptDireReportedResult: ' + cptDireResultReport);

						if (cptRadResultReport && cptDireResultReport) {
							if (cptRadResultReport.result == cptDireResultReport.result) {

								var reasonableTimeElapsedSinceMatchLobbyCreated = true;
								var matchDetailsCreatedDttm = moment(matchDetails.createdDttm);
								var durationSinceCreation = moment.duration(moment().diff(matchDetailsCreatedDttm));

								if (duration.minutes() > 10) {
									reasonableTimeElapsedSinceMatchLobbyCreated = true;
								} else {
									reasonableTimeElapsedSinceMatchLobbyCreated = false;
								}

								m.result = cptRadResultReport.result;
								takeActionOnMatchDetailsBasedOnResult(m, reasonableTimeElapsedSinceMatchLobbyCreated);

							} else {
								updateMatchDetailsResultAsInvestigation(m);
							}
						} else {
							//The point is that, we will in general, use the cpt report as absolute
							//hence we give a 3 hours grace peroid starting from first match report timing

							console.log('resultReportedDttm: ' + g.matchResultReportedDttm);

							var reportDttm = moment(g.matchResultReportedDttm);
							var duration = moment.duration(moment().diff(reportDttm));

							//console.log(duration);
							console.log(duration.minutes());
							console.log(duration.hours());

							//TODO section Z
							if (duration.hours() >= 3) {
								//after 3 hours, we will take the party member reports into consideration

								if (g.resultReports.size()>0) {
									var topResult = getMostPopularResult(g);

									if (topResult) {
										matchDetails.result = topResult;
										takeActionOnMatchDetailsBasedOnResult(matchDetails, true);
									} else {
										updateMatchDetailsResultAsInvestigation(m);
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

var getMostPopularResult = function(game) {
	var countV = 0;
	var countR = 0;
	var countD = 0;

	_.each(game.resultReports, function(item) {
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

var updateMatchDetailsResultAsInvestigation = function(matchDetails) {
	console.log('Match pending investigation!');
	//TODO XZ: implement CommonConstants
	MatchesCollection.update(
		{
			_id : matchDetails._id
		},
		{
			status : 'PI',
			result : matchDetails.result
		}
	);
}

var takeActionOnMatchDetailsBasedOnResult = function(matchDetails, reasonableTimeElapsedSinceMatchLobbyCreated) {
	//TODO XZ: implement CommonConstants
	switch (matchDetails.result) {
		case 'V':
			//TODO delete match and game
			console.log('Match deleted(Void)');
			break;
		case 'R':
		case 'D':
			if (reasonableTimeElapsedSinceMatchLobbyCreated) {
				MatchesCollection.update(
					{
						_id : matchDetails._id
					},
					{
						status : 'PU',
						result : matchDetails.result
					}
				);
				Meteor.call('sendMatchDetailsToMainDB', matchDetails._id);
			} else {
				//potentially some1 is abusing the system
				//i.e. both cpt just spam DIRE win without any games played to boost result
				updateMatchDetailsResultAsInvestigation(matchDetails);
			}
			break;
	}
}
