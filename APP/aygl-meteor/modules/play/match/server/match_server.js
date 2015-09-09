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
		console.log('user not found for: ' + username);
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
		console.log('user not found for: ' + username);
	} else {
		if (increase) {
			updateUserThumbsDownCount(username, user.profile.thumbsDownCount + 1);
		} else {
			updateUserThumbsDownCount(username, user.profile.thumbsDownCount - 1);
		}
	}
}

Meteor.methods({
	demo11: function() {
		console.log("hi guys");

		MyLogger.insert({
	      type: "info",
	      message: "huatah"
	    });

	    var a = Logger.findOne();

	    console.log(a);
	},
	demo2: function() {
		generateMatchPassword();
	},
	insertPlayerReview: function(reviewee, type, comment) {
		PlayerReview.insert({
            reviewer: Meteor.user().username,
            reviewee: reviewee,
            type: type,
            comment: comment
            // gameId: optional //not used for now
            // matchId: optional //not used for now
            // matchDuration: optional,
        });

        switch (type) {
        case PLAYER_REVIEW_TYPE_UP:
        	increaseUserThumbsUpCount(reviewee, true);
        	break;
        case PLAYER_REVIEW_TYPE_DOWN:
        	increaseUserThumbsDownCount(reviewee, true);
        	break;
        }
	},
	increaseUserThumbsUpCount: function(username, increase) {
		// console.log(username);
		// console.log(increase);
		increaseUserThumbsUpCount(username, increase);
	},
	increaseUserThumbsDownCount: function(username, increase) {
		increaseUserThumbsDownCount(username, increase);
	},
	updatePlayerResultReport: function(result) {
		var user = getUserByUserId(Meteor.userId());

		var matchId = user.profile.room;
		var m = MatchesCollection.findOne({_id: matchId}) || MatchesCollection.findOne();

		var username = user.username;
		var playerSlot = getPlayerSlotOfUserFromMatchDetails(m, username);

		//TODO TBR (to be removed)
        var g = Games.findOne({}); 	//demo for dev purpose only
        var gameId = m.gameId || g._id;

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
		console.log('sendMatchDetailsToMainDB');

		var matchDetails = MatchesCollection.findOne({
			_id : matchId
		});

		//hardcoded for dev
		if (!matchDetails) {
			matchDetails = MatchesCollection.findOne();
		}

		console.log(matchDetails);

		var matchString = JSON.stringify(matchDetails);

		console.log(matchString);

	    var header = '/match';
	    var payload = matchString;
	    var hash = ayglHash(header, payload);

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
	// console.log('updateUserThumbsUpCount start');
	// console.log('username: ' +  username);
	// console.log('newCount: ' +  newCount);

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
	// console.log('updateUserThumbsDownCount start');
	// console.log('username: ' +  username);
	// console.log('newCount: ' +  newCount);

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
	console.log('Start of checkMatchResultReports');

	var g = Games.findOne({_id: gameId}) || Games.findOne({});

	if (!g) {
		console.log('game no found, perhaps its already processed?');
	} else {
		if (!g.resultReports) {
			g.resultReports = [];
		}

		// console.log(g);
		// console.log('==========');

		var count = 0;
		_.each(g.resultReports, function(item) {
			if(item !== null) {
				count++;
			}
		});

		// console.log('count: ' + count);

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
				var m = MatchesCollection.findOne({'gameId': g._id}) || MatchesCollection.findOne();
				//we fetch latest before taking action cos maybe some1 else's action already resolved this game

				if (!m) {
					console.log('There is a big problem, why is there no matchDetails?');
				} else {
					console.log(m.result);
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

						console.log('cptRadReportedResult: ' + cptRadResultReport);
						console.log('cptDireReportedResult: ' + cptDireResultReport);

						if (cptRadResultReport && cptDireResultReport) {
							console.log('both cpt reported result');
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
							console.log('not both cpt reported result yet');


							//The point is that, we will in general, use the cpt report as absolute
							//hence we give a 3 hours grace peroid starting from first match report timing

							console.log('resultReportedDttm: ' + g.matchResultReportedDttm);

							var reportDttm = moment(g.matchResultReportedDttm);
							var duration = moment.duration(moment().diff(reportDttm));

							//console.log(duration);
							console.log(duration.minutes());
							console.log(duration.hours());

							var moreThan3Hours = duration.hours() >= 3;
							//TODO section Z
							if (true) { //supposed to be moreThan3Hours
								//after 3 hours, we will take the party member reports into consideration

								console.log(g);
								console.log('===============');
								console.log(g.resultReports);
								console.log('===============');


								console.log('_.size(g.resultReports)');
								console.log(_.size(g.resultReports));

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

	console.log('hi im checking the content of getMostPopularResult()');
	console.log(counts);

	if (counts[1] == counts[2]) {
		return null;
	} else {
		return counts[2].result;
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
			$set: {
				status : 'PI',
				result : matchDetails.result
			}
		}
	);
}

var takeActionOnMatchDetailsBasedOnResult = function(matchDetails, reasonableTimeElapsedSinceMatchLobbyCreated) {
	//TODO XZ: implement CommonConstants

	console.log("matchDetails._id");
	console.log(matchDetails._id);

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
