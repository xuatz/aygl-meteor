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
