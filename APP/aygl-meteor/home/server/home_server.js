/*
======================================================================================================
Error Definitions for Home Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/

home_error_001_ALREADY_IN_GAME = new Meteor.Error('Home_Err_001', 'You are already part of a game.');
home_error_002_TITLE_TOO_LONG = new Meteor.Error('Home_Err_002', 'The title cannot exceed 45 characters');


/*
======================================================================================================
Server Methods
Methods used by during the Matchmaking/Drafting/Display process will be placed here
======================================================================================================
*/

Meteor.methods({
    createNewGame: function(title, matchmaking_threshold) {

        //Get the user who called the method
        var hostingplayer = Meteor.users.findOne({
            _id: this.userId
        });

        //Check if user is already part of a game
        if (hostingplayer.profile.state === 'hosting' ||
            hostingplayer.profile.state === 'drafting' ||
            hostingplayer.profile.state === 'in-match' ||
            hostingplayer.profile.state === 'waiting') {
            throw home_error_001_ALREADY_IN_GAME;
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
                percentile: 49
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
            return;
        } else if (targetUser.profile.state === "hosting" || targetUser.profile.state === "drafting") {
            //User is a captain. We must remove the game and inform the involved players about the removal
            //Removing Game
            Games.remove({
                _id: targetUser.profile.room
            });

            //TODO: Notification for other users

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

        //Setting status to idle
        Meteor.users.update({
            _id: targetUser._id
        }, {
            $set: {
                "profile.state": "idle"
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
            $in: ['hosted', 'drafting', 'in-progress']
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
