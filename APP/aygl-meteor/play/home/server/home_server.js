/*
======================================================================================================
Error Definitions for Home Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/

home_error_001_PLAYER_IS_BUSY = new Meteor.Error('Home_Err_001', 'Player is not idle. Reset state to idle first.');
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

    },
    joinPool: function() {
        //Sets the player's state to ready to join the player pool
        if (Meteor.user().profile.state !== 'idle') {
            throw home_error_001_PLAYER_IS_BUSY;
        } else {
            Meteor.users.update({
                _id: this.userId
            }, {
                $set: {
                    "profile.state": 'ready'
                }
            });
        }
    },
    grabPlayersFromWaiting: function(eligiblePlayerList) {
        //Use only the first 8 results.
        var chosenOnes = _.first(eligiblePlayerList, 8);
        var gameId = Meteor.user().profile.room;
        home_grabPlayers(chosenOnes, gameId, function(grabResult, reservedPlayers) {
            if (grabResult) {
                console.log('Reserved ' + reservedPlayers + ' players for match ' + Meteor.user().profile.room);
                home_initializeGrabResult(gameId, 'drafting');
            } else {
                console.log('Failed to grab. Only grabbed ' + reservedPlayers + ' players.');
                //Do nothing because already in waiting state.
            }
        });
    }
});


/*
======================================================================================================
Server side method definitions
Method defined below can only be called from within server code
======================================================================================================
*/
home_challengeAccepted = function(alert) {
    //Remove all other challengers from the Game
    Games.update({
        _id: alert.data
    }, {
        $pull: {
            challengers: {
                name: {
                    $ne: alert.recipient
                }
            }
        }
    });

    //Reset all other challengers' states
    Meteor.users.update({
        "profile.room": alert.data,
        "profile.state": "pending accept",
        "username": {
            $ne: alert.recipient
        }
    }, {
        $set: {
            "profile.state": "idle",
            "profile.room": null
        }
    }, {
        multi: true
    });

    //Check eligibility
    home_checkLobbyEligibility(alert, function(result, playerList) {
        if (result) {
            //Use only the first 8 results.
            var chosenOnes = _.first(playerList, 8);
            //Attempt Grab players
            home_grabPlayers(chosenOnes, alert.data, function(grabResult, reservedPlayers) {
                if (grabResult) {
                    console.log('Reserved ' + reservedPlayers + ' players for match ' + alert.data)
                    home_initializeGrabResult(alert.data, 'drafting');
                } else {
                    console.log('Failed to grab. Only grabbed ' + reservedPlayers + ' players.');
                    home_initializeGrabResult(alert.data, 'waiting');
                }
            });
        } else {
            //Go to Waiting
            home_initializeGrabResult(alert.data, 'waiting');
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

    //Update Game to reflect lobby percentile
    Games.update({
        _id: alert.data
    }, {
        $set: {
            lobbyPercentile: avgPercentile
        }
    });

    //Count available players
    var eligiblePlayerCursor = home_eligiblePlayers(avgPercentile);
    var eligiblePlayerList = eligiblePlayerCursor.fetch();

    //Filter out 'ready' players only
    var actualEligibleList = _.filter(eligiblePlayerList, function(player) {
        var result = false;
        if (player.profile.state === 'ready') {
            result = true;
        }
        return result;
    });
    var eligibilePlayerCount = actualEligibleList.length;

    console.log('ELIGIBLE PLAYER COUNT: ' + eligibilePlayerCount);

    var result;
    if (eligibilePlayerCount > 7) {
        result = true;
        callback(result, actualEligibleList);
    } else {
        result = false;
        callback(result);
    }
});

home_initializeGrabResult = function(gameId, result) {
    var gameObj = Games.findOne({
        _id: gameId
    });
    //Update states of Captains
    console.log('Updating ' + gameObj.host.name + ' and ' + gameObj.challengers[0].name);
    Meteor.users.update({
        username: {
            $in: [gameObj.host.name, gameObj.challengers[0].name]

        }
    }, {
        $set: {
            "profile.state": result
        }
    }, {
        multi: true
    });

    //Update state of Lobby and prep for Drafting phase
    Games.update({
        _id: gameId
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
            "profile.state": {
                $in: ['ready', 'reserved']
            },
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
            "profile.state": {
                $in: ['ready', 'reserved']
            },
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

home_grabPlayers = Meteor.wrapAsync(function(arrayOfPlayers, gameId, callback) {
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
            "profile.state": 'ready'
        }]
    }, {
        $set: {
            "profile.state": 'reserved',
            "profile.room": gameId
        }
    }, {
        multi: true
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
                "profile.state": 'ready',
                "profile.room": null
            }
        }, {
            multi: true
        });

        if (unreservedPlayers === reservedPlayers) {
            console.log('Cancellation succeeded.')
        } else {
            console.log('Cancellation failed.')
        }

        callback(false, reservedPlayers);
    }
});
