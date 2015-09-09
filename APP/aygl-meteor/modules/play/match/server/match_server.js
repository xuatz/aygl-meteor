var crypto = Npm.require('crypto')
	,Future = Npm.require('fibers/future');


//debug purpose
Meteor.publish("PlayerReview", function () {
  	return PlayerReview.find();
});

var increaseUserThumbsUpCount = function (username, increase) {
	var user = Meteor.users.findOne({
		username: username
	});

	if (!user) {
		logger.debug('user not found for: ' + username);
	} else {
		if (increase) {
			updateUserThumbsUpCount(username, user.profile.thumbsUpCount + 1);
		} else {
			updateUserThumbsUpCount(username, user.profile.thumbsUpCount - 1);
		}
	}
}

var increaseUserThumbsDownCount = function(username, increase) {
	var user = Meteor.users.findOne({
		username: username
	});

	if (!user) {
		logger.debug('user not found for: ' + username);
	} else {
		if (increase) {
			updateUserThumbsDownCount(username, user.profile.thumbsDownCount + 1);
		} else {
			updateUserThumbsDownCount(username, user.profile.thumbsDownCount - 1);
		}
	}
}

Meteor.methods({
	insertPlayerReview: function(reviewee, type, comment, matchId) {
		PlayerReview.upsert(
		{
			matchId: matchId,
			reviewer: Meteor.user().username,
            reviewee: reviewee
		},
		{
			$set : {
				type: type,
	            comment: comment
	            // matchDuration: optional,
			}
        });
	},
	updatePlayerResultReport: function(result) {
		/*
		//old code
		var user = getUserByUserId(Meteor.userId());
		var matchId = user.profile.room;
		*/

		var matchId = Meteor.user().profile.room;
		var m = MatchesCollection.findOne({_id: matchId});

		var username = user.username;
		var playerSlot = getPlayerSlotOfUserFromMatchDetails(m, username);

		var gameId = m.gameId;

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
	sendMatchDetailsToMainDB: function(matchId) {
		logger.debug('sendMatchDetailsToMainDB');

		var matchDetails = MatchesCollection.findOne({
			_id : matchId
		});

		//hardcoded for dev
		if (!matchDetails) {
			matchDetails = MatchesCollection.findOne();
		}

		logger.debug(matchDetails);

		var matchString = JSON.stringify(matchDetails);

		logger.debug(matchString);

	    var header = '/match';
	    var payload = matchString;
	    var hash = ayglHash(header, payload);

	    // logger.debug('==================');
	    // logger.debug(hash);

	    var fut = new Future();

	    HTTP.call("POST", "http://localhost:3000/match",
	        {
	            headers: {
	                authorization: "aygldb " + hash
	            }
	            , params: {matchDetails: matchString}
	        }, function(err, res) {
	        	if (err) {
	        		logger.debug('==================');
	        		logger.debug('there is an error');
	        		logger.debug(err);

	        		//TODO log error somewhere???

	        		fut.throw(err);
	        	}
	        	if (res) {
	        		logger.debug('==================');
	        		logger.debug('there is an res');
	        		logger.debug(res);
	        		logger.debug('==================');
	        		logger.debug(res.content);

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
								$set: {
									status : 'PU'
								}

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

var updateUserThumbsUpCount = function(username, newCount) {
	// logger.debug('updateUserThumbsUpCount start');
	// logger.debug('username: ' +  username);
	// logger.debug('newCount: ' +  newCount);

	Meteor.users.update(
		{
			username: username
		},
		{
			$set: {
				thumbsUpCount: newCount
			}
		}
	);
}

var updateUserThumbsDownCount = function(username, newCount) {
	// logger.debug('updateUserThumbsDownCount start');
	// logger.debug('username: ' +  username);
	// logger.debug('newCount: ' +  newCount);

	Meteor.users.update(
		{
			username: username
		},
		{
			$set: {
				thumbsDownCount: newCount
			}
		}
	);
}

var checkMatchResultReports = function(gameId) {
	logger.debug('Start of checkMatchResultReports');

	var g = Games.findOne({_id: gameId}) || Games.findOne({});

	if (!g) {
		logger.debug('game no found, perhaps its already processed?');
	} else {
		if (!g.resultReports) {
			g.resultReports = [];
		}

		// logger.debug(g);
		// logger.debug('==========');

		var count = 0;
		_.each(g.resultReports, function(item) {
			if(item !== null) {
				count++;
			}
		});

		// logger.debug('count: ' + count);

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

				logger.debug('check if the local object is updated');
				logger.debug('g.matchResultReportedDttm: ' + g.matchResultReportedDttm);
				logger.debug(g.matchResultReportedDttm);

				logger.debug('im fetching the game again from db, compare the value with above!');
				g = Games.findOne({});
				//g = Games.findOne({'_id': gameId});
				logger.debug('resultReportedDttm: ' + g.matchResultReportedDttm);

			} else {
				//TODO DT: note: upon draft completion, a matchDetails will be created liao, with the games._id as FK
				var m = MatchesCollection.findOne({'gameId': g._id}) || MatchesCollection.findOne();
				//we fetch latest before taking action cos maybe some1 else's action already resolved this game

				if (!m) {
					logger.debug('There is a big problem, why is there no matchDetails?');
				} else {
					logger.debug(m.result);
					m.result = null;
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

						logger.debug('cptRadReportedResult: ' + cptRadResultReport);
						logger.debug('cptDireReportedResult: ' + cptDireResultReport);

						if (cptRadResultReport && cptDireResultReport) {
							logger.debug('both cpt reported result');
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
							logger.debug('not both cpt reported result yet');


							//The point is that, we will in general, use the cpt report as absolute
							//hence we give a 3 hours grace peroid starting from first match report timing

							logger.debug('resultReportedDttm: ' + g.matchResultReportedDttm);

							var reportDttm = moment(g.matchResultReportedDttm);
							var duration = moment.duration(moment().diff(reportDttm));

							//logger.debug(duration);
							logger.debug(duration.minutes());
							logger.debug(duration.hours());

							var moreThan3Hours = duration.hours() >= 3;
							//TODO section Z
							if (true) { //supposed to be moreThan3Hours
								//after 3 hours, we will take the party member reports into consideration

								logger.debug(g);
								logger.debug('===============');
								logger.debug(g.resultReports);
								logger.debug('===============');


								logger.debug('_.size(g.resultReports)');
								logger.debug(_.size(g.resultReports));

								if (_.size(g.resultReports)>0) {
									var topResult = getMostPopularResult(g);

									if (topResult) {
										m.result = topResult;
										takeActionOnMatchDetailsBasedOnResult(m, true);
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

	logger.debug('hi im checking the content of getMostPopularResult()');
	logger.debug(counts);

	if (counts[1] == counts[2]) {
		return null;
	} else {
		return counts[2].result;
	}
}

var updateMatchDetailsResultAsInvestigation = function(matchDetails) {
	logger.debug('Match pending investigation!');
	//TODO XZ: implement CommonConstants
	MatchesCollection.update(
		{
			_id : matchDetails._id
		},
		{
			$set: {
				status : 'PI',
				result : matchDetails.result
			}
		}
	);
}

var takeActionOnMatchDetailsBasedOnResult = function(matchDetails, reasonableTimeElapsedSinceMatchLobbyCreated) {
	//TODO XZ: implement CommonConstants

	logger.debug("matchDetails._id");
	logger.debug(matchDetails._id);

	switch (matchDetails.result) {
		case 'V':
			//TODO delete match and game
			logger.debug('Match deleted(Void)');
			break;
		case 'R':
		case 'D':
			if (reasonableTimeElapsedSinceMatchLobbyCreated) {
				MatchesCollection.update(
					{
						_id : matchDetails._id
					},
					{
						$set: {
							status : 'PU',
							result : matchDetails.result
						}
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
