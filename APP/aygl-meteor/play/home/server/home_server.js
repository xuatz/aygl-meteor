/*
======================================================================================================
Error Definitions for Home Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/

home_error_001_PLAYER_IS_BUSY = new Meteor.Error('Home_Err_001', 'Player is not idle. Cannot create match.');
home_error_002_TITLE_TOO_LONG = new Meteor.Error('Home_Err_002', 'The title cannot exceed 45 characters');
home_error_003_CANNOT_CHALLENGE_HOST = new Meteor.Error('Home_Err_003', 'Error while challenging host.');
home_error_004_CANNOT_CHALLENGE_MULTIPLE_HOST = new Meteor.Error('Home_Err_004', 'Cannot challenge more than one host at a time.');


/*
======================================================================================================
Meteor Methods
Methods used by during the Matchmaking/Drafting/Display process will be placed here
======================================================================================================
*/

Meteor.methods({
    createNewGame: function(title, matchmaking_threshold) {

        //Get the user who called the method
        var hostingplayer = Meteor.users.findOne({
            _id: this.userId
        });

        //Check if player is allowed to create a game (must be IDLE)
        if (hostingplayer.profile.state !== "idle") {
            throw home_error_001_PLAYER_IS_BUSY;
        }


        //Check if the title is too long
        if (title.length > 45) {
            throw home_error_002_TITLE_TOO_LONG;
        }

        //Setting the default title if needed
        if (!title || title.trim() === '') {
            title = "Just Another AYGL Match";
        }

        //Create the game JSON to be inserted into the Collection
        var newGame;
        newGame = {
            draft: {
                radiant: null,
                dire: null
            },
            state: 'hosted',
            host: {
                name: hostingplayer.username,
                personaname: hostingplayer.profile.personaname,
                percentile: hostingplayer.profile.ranking.percentile
            },
            challengers: [],
            avatar: hostingplayer.profile.avatar,
            matchmaking_threshold: matchmaking_threshold,
            title: title
        };
        //Insert the new Game JSON into the Collection
        var gameId = Games.insert(newGame);

        //Modify the Host's status
        Meteor.users.update({
            _id: this.userId
        }, {
            $set: {
                "profile.state": 'hosting',
                "profile.room": gameId
            }
        });

        return gameId;
    },
    challengecpt: function(gameId) {
        var challenger = Meteor.users.findOne({
            _id: this.userId
        });

        //Ensure challenger does not simultaneously challenge multiple captains
        if (challenger.profile.state === "pending accept") {
            throw home_error_004_CANNOT_CHALLENGE_MULTIPLE_HOST;
        }

        //Get the info from the challenger
        var result = {};

        result.name = challenger.username;
        result.personaname = challenger.profile.personaname;
        result.avatar = challenger.profile.avatar;

        if (!challenger.profile.ranking.percentile) {
            //GET FROM STATSDB (this might not be necesary. Continue to monitor behavior)
        } else {
            result.percentile = challenger.profile.ranking.percentile;
        }

        //Update the Game Object

        var updateResult = Games.update({
            _id: gameId
        }, {
            $push: {
                "challengers": result
            }
        });

        if (!updateResult) {
            //display an error message for failed insert
            throw home_error_003_CANNOT_CHALLENGE_HOST;
        } else {
            //if successful, change the user's state to "pending accept"
            Meteor.users.update({
                _id: this.userId
            }, {
                $set: {
                    "profile.state": "pending accept",
                    "profile.room": gameId
                }
            });
        }

        return updateResult;

    }
});


/*
======================================================================================================
Server side method definitions
Method defined below can only be called from within server code
======================================================================================================
*/
home_challengeAccepted = function(alert) {
    //Check eligibility
    home_checkLobbyEligibility(alert, function(result, playerList) {
        if (result) {
            //Use only the first 8 results.
            var chosenOnes = _.first(playerList, 8);
            //Attempt Grab players
            home_grabPlayers(chosenOnes, function(grabResult, reservedPlayers) {
                if (grabResult) {
                    console.log('Reserved ' + reservedPlayers + ' players for match ' + alert.data)
                    home_initializeGrabResult(alert, 'drafting');
                } else {
                    console.log('Failed to grab. Only grabbed ' + reservedPlayers + ' players.');
                    home_initializeGrabResult(alert, 'waiting');
                }
            });
        } else {
            //Go to Waiting
            home_initializeGrabResult(alert, 'waiting');
        }
    });

};

home_checkLobbyEligibility = Meteor.wrapAsync(function(alert, callback) {
    var gameObj = Games.findOne({
        _id: alert.data
    });
    //Calculate average percentile
    var hostPercentile = gameObj.host.percentile;
    var challengerPercentile = _.find(gameObj.challengers, function(challenger) {
        return challenger.name === alert.recipient;
    }).percentile;
    var avgPercentile = (hostPercentile + challengerPercentile) / 2;

    //Count available players
    var eligiblePlayerCursor = home_eligiblePlayers(avgPercentile);
    var eligiblePlayerList = eligiblePlayerCursor.fetch();
    var eligibilePlayerCount = eligiblePlayerCursor.count();

    console.log('ELIGIBLE PLAYER COUNT: ' + eligibilePlayerCount);

    var result;
    if (eligibilePlayerCount > 7) {
        result = true;
        callback(result, eligiblePlayerList);
    } else {
        result = false;
        callback(result);
    }
});

home_initializeGrabResult = function(alert, result) {
    //Update states of Captains
    Meteor.users.update({
        username: {
            $in: [alert.recipient, alert.sender]

        }
    }, {
        $set: {
            "profile.state": result
        }
    });

    if (result === 'drafting') {
        //Remove all other Challengers from Game
        Meteor.users.update({
            "profile.room": alert.data,
            "profile.state": "pending accept"
        }, {
            $set: {
                "profile.state": "idle",
                "profile.room": null
            }
        }, {
            multi: true
        });
    }
    //Update state of Lobby
    Games.update({
        _id: alert.data
    }, {
        $set: {
            state: result
        }
    });

}

home_eligiblePlayers = function(avgPercentile) {
    var result;
    if (avgPercentile < 60) {
        result = Meteor.users.find({
            "profile.state": "ready",
            "profile.ranking.pLowerLimit": {
                $lt: avgPercentile
            },
            "profile.ranking.pUpperLimit": {
                $gt: avgPercentile
            },
            "profile.ranking.percentile": {
                $lt: 60
            }
        }, {
            fields: {
                username: 1,
                profile: 1
            }
        });

    } else {
        result = Meteor.users.find({
            "profile.state": "ready",
            "profile.ranking.pLowerLimit": {
                $lt: avgPercentile
            },
            "profile.ranking.pUpperLimit": {
                $gt: avgPercentile
            }
        }, {
            fields: {
                username: 1,
                profile: 1
            }
        });
    }
    return result;
}

home_grabPlayers = Meteor.wrapAsync(function(arrayOfPlayers, callback) {
    var arrayOfPlayerNames = _.map(arrayOfPlayers, function(player) {
        return player.username;
    });
    //Try to reserve 8 players for captain.
    var reservedPlayers = Meteor.users.update({
        $and: [{
            username: {
                $in: arrayOfPlayerNames
            }
        }, {
            // "profile.state": 'ready'
        }]
    }, {
        $set: {
            "profile.state": 'reserved'
        }
    });
    console.log(reservedPlayers + ' grabbed.');
    if (reservedPlayers > 7) {
        console.log('GRAB SUCCESSFUL');
        callback(true, reservedPlayers);
    } else {
        console.log('GRAB FAILED. Cancelling players reservations.');
        var unreservedPlayers = Meteor.users.update({
            $and: [{
                username: {
                    $in: arrayOfPlayerNames
                }
            }, {
                "profile.state": 'reserved'
            }]
        }, {
            $set: {
                "profile.state": 'ready'
            }
        });

        if (unreservedPlayers === reservedPlayers) {
            console.log('Cancellation succeeded.')
        } else {
            console.log('Cancellation failed.')
        }

        callback(false, reservedPlayers);
    }
});
