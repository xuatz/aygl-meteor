/*
======================================================================================================
Server Methods
Methods used by during the Matchmaking/Drafting/Display process will be placed here
======================================================================================================
*/

var crypto = Npm.require('crypto');

generateMatchPassword = function() {
    var now = new Date();
    var hash = crypto.createHash('md5')
                .update(now.toString())
                .digest("hex");

    return hash.substring(0,8)
}

Meteor.methods({
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

        if (targetUser.profile.state === "idle" || targetUser.profile.state === "in-match") {
            //All is well, do nothing
            /*
                If a player is currently in a match, do not change his state in order to force him to report
                the match results before continuing.

                Take note that, once a match result has been officially decided, there shld be a method to
                reset all players who are in that match to "idle"
            */

            return;
        } else if (targetUser.profile.state === "hosting" || targetUser.profile.state === "drafting") {
            //User is a captain. We must remove the game and inform the involved players about the removal
            //Removing Game
            Games.remove({
                _id: targetUser.profile.room
            });

            //TODO: Notification for other users

            //Reset all involved players
            Meteor.users.update({
                "profile.room": targetUser.profile.room
            }, {
                $set: {
                    "profile.state": "idle",
                    "profile.room": null
                }
            }, {
                multi: true
            });



        } else if (targetUser.profile.state === "pending accept") {
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

        } else if (targetUser.profile.state === "ready" || targetUser.profile.state === "reserved") {
            //User shld be returned to idle. Nothing else done.
            //DOING NOTHING NOW
        } else if (targetUser.profile.state === "selected") {
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
        }

        //Setting status to idle and reset room value to null
        Meteor.users.update({
            _id: targetUser._id
        }, {
            $set: {
                "profile.state": "idle",
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
