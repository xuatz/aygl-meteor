/*
======================================================================================================
Server Methods
Methods used by during the Matchmaking/Drafting/Display process will be placed here
======================================================================================================
*/

Meteor.methods({
    editPreferences: function(doc) {
        check(doc, Schemas.ProfileMatchmaking);
        this.unblock();
        // Update Meteor.users
        Meteor.users.update(
            {_id: this.userId},
            { $set: {
                "profile.matchmaking": doc
            }}
        );
    },
    resetState: function(user) {
        //If and only if, called by SERVER, take note of the userId supplied, else perform reset on the user who called the method
        var targetUser;
        if (!this.userId) {
            targetUser = user;
        } else {
            targetUser = Meteor.users.findOne({
                _id: this.userId
            });
        }

        switch (targetUser.profile.state) {
        case PLAYER_STATE_IDLE:
            //All is well, do nothing
            /*
                If a player is currently in a match, do not change his state in order to force him to report
                the match results before continuing.

                Take note that, once a match result has been officially decided, there shld be a method to
                reset all players who are in that match to "idle"
            */
            return;
            break; //probably dun need this line due to return
        case PLAYER_STATE_IN_MATCH:
            /*
            XZ:10/9/15: i think, if already in match lobby, if any1 zhao, just let it be
            they can get reported if needed. proceed with the default reset function below
            */
            break;
        case PLAYER_STATE_HOSTING:
        case PLAYER_STATE_DRAFTING:
        case PLAYER_STATE_WAITING:
            //User is a captain. We must remove the game and inform the involved players about the removal
            //Removing Game
            Games.remove({
                _id: targetUser.profile.room
            });

            //TODO: Notification for other users

            //Reset all involved players
            
            //'Reserved' and 'Selected' -> Ready
            Meteor.users.update({
                "profile.room": targetUser.profile.room,
                "profile.state": {
                    $in: ['reserved', 'selected']
                }
            }, {
                $set: {
                    "profile.state": "ready",
                    "profile.room": null
                }
            }, {
                multi: true
            });

            //'pending accept', 'drafting' and 'waiting' -> Idle
            Meteor.users.update({
                "profile.room": targetUser.profile.room,
                "profile.state": {
                    $in: ['drafting', 'pending accept', 'waiting']
                }
            }, {
                $set: {
                    "profile.state": "idle",
                    "profile.room": null
                }
            }, {
                multi: true
            });

            break;
        case PLAYER_STATE_PENDING_ACCEPT:
            //User has challenged a captain. He/She should be removed from the Game list and reset to idle
            //Remove the player from the Challengers' List
            Games.update({
                _id: targetUser.profile.room
            }, {
                $pull: {
                    challengers: {
                        name: targetUser.username
                    }
                }
            });

            //Server will auto-reject all pending alerts, responding with a disconnect message
            Alerts.update({
                recipient: targetUser._id,
                isHandled: false
            }, {
                $set: {
                    isHandled: true,
                    response: "disconnected"
                }
            }, {
                multi: true
            });
            break;

        case PLAYER_STATE_READY:
        case PLAYER_STATE_RESERVED:
            //User shld be returned to idle. Nothing else done.
            //DOING NOTHING NOW
            break;
        case PLAYER_STATE_SELECTED:
            /*
            TODO XZ:10/9/15: this is very questionable. 
            what happens to the drafting if they are missing 1 player originally drafted?
            I'm afraid that this is quite tricky
            */

            //User was already drafted into a team. He/She should be removed from the team
            Games.update({
                _id: targetuser.profile.room
            }, {
                $pull: {
                    "draft": {
                        name: targetUser.username
                    }
                }
            });
            break;
        }

        //Setting status to idle and reset room value to null
        Meteor.users.update({
            _id: targetUser._id
        }, {
            $set: {
                "profile.state": PLAYER_STATE_IDLE,
                "profile.room": null
            }
        });
    },
    changeState: function(state) {
        //DEBUGGING TOOL. REMOVE BEFORE PRODUCTION
        Meteor.users.update({
            _id: this.userId
        }, {
            $set: {
                "profile.state": state
            }
        });
    }
});

/*
======================================================================================================
MongoDB Publishes
Below are the MongoDB Collections which will be used by this module.

Note: 

Being published merely makes a Collection available for subscription, but does NOT automatically
subscribe all users to the collection

If a collection is used by modules which are siblings to this module, the collection should be defined
in the parent directory's javascript file
======================================================================================================
*/

/*
    Gives users access to:
    1) Matches which are hosted/drafting
*/
Meteor.publish('displayCurrentMatches', function() {
    var result;
    result = Games.find({
        state: {
            $in: ['hosted', 'drafting', 'waiting']
        }
    });
    return result;
});

/*
    Allows Captains to see entire pool of players (when needed for drafting)
*/

Meteor.publish('playerpool', function() {
    var result = Meteor.users.find({
        $and: [{
            "profile.state": {
                $in: ['ready', 'reserved']
            }
        }, {
            "status.online": true
        }]
    }, {
        fields: {
            "profile.avatar": 1,
            "profile.matchmaking": 1,
            username: 1
        }
    });

    return result;
});

/*
    Allows Captains who are hosting to view Challengers' profiles
*/
Meteor.publish('hostingMatch', function(challengerArray) {
    var result;
    Meteor.users.find({
        username: {
            $in: challengerArray
        }
    }, {
        fields: {
            profile: 1
        }
    });
});

/*
    Allows captains to see players who are eligible for drafting
*/
Meteor.publish('getEligiblePlayers', function(avgPercentile) {
    return home_eligiblePlayers(avgPercentile);
});

/*
======================================================================================================
MISC Server Code for Home module
======================================================================================================
*/

Meteor.users.find({
    "status.online": true
}).observe({
    added: function(id) {
        // id just came online
    },
    removed: function(id) {
        // id just went offline
        var pstate = id.profile.state;
        Meteor.call('resetState', id);
    }
});
