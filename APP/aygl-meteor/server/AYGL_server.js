/*
======================================================================================================
Server Side Collection Publishes
Collection Publication for the app will be defined here
======================================================================================================
*/

/*
    Allow users to find their own temporary profiles during registration
*/
Meteor.publish('registeringPlayers', function(sig) {
    return VerifyTab.find({
        sig: sig
    });
});


/*
    Gives users access to:
    1) Ended Matches which they were a part of
*/
Meteor.publish('match_history', function() {
    var username = Meteor.users.findOne({
        _id: this.userId
    }).username;

    var result = Games.find({
        $and: [{
            $or: [{
                "teams.radiant": {
                    $elemMatch: username
                },
                "teams.dire": {
                    $elemMatch: username
                }
            }]
        }, {
            status: {
                $in: ['ended']
            }
        }]
    });
    return result;

});

/*
    Allows all Users basic information (rarely updated) of a user
*/
Meteor.publish('allbasicinfo', function() {
    var result = Meteor.users.find({}, {
        fields: {
            "profile.personaname": 1,
            "profile.avatar": 1,
            username: 1
        }
    });
});


/*
======================================================================================================
MISC Server Code
======================================================================================================
*/

/*
    Polls the Steam API every 5 seconds for missing information in the temporary VerifyTab collection and
    Meteor.users collection to check if there are updated flags which are set to false (outdated) or do
    not exist (new) entries.
*/
Meteor.setInterval(function() {
    var STEAMKEY = '1E6F8CF6D531EB7ACD9AF9F08C41F02B';
    var api_steam_playerSummary = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + STEAMKEY;
    var playersToUpdate = Meteor.users.find({
        "profile.updated": {
            $ne: true
        }
    }, {
        fields: {
            "profile.steamID": 1
        },
        limit: 25
    }).fetch();
    var playersToRetrieve = VerifyTab.find({
        updated: {
            $ne: true
        }
    }, {
        fields: {
            steamID: 1
        },
        limit: 75
    }).fetch();
    var playersList = playersToUpdate.map(function(x) {
        return x.profile;
    });

    for (x in playersToRetrieve) {
        playersList.push(playersToRetrieve[x]);
    }
    var steamIDs;
    var doRetrieve = false;

    if (playersList.length >= 1) {
        doRetrieve = true;
        steamIDs = playersList[0]['steamID'];
    }

    if (playersList.length > 1) {
        for (var i = 1; i < playersList.length; i++) {
            steamIDs = steamIDs + ',' + playersList[i]['steamID'];
        }
    }
    if (doRetrieve) {
        console.log('---------- Account Retrieval Start ----------');
        console.log(playersToUpdate.length + ' profile refreshes');
        console.log(playersToRetrieve.length + ' registration verifications');
        var url = api_steam_playerSummary + '&steamids=' + steamIDs;
        var registerCount = 0;
        var userCount = 0;

        HTTP.call('GET', url, function(err, res) {
            if (res !== null) {
                var playerArray = res.data.response.players;
                console.log('---------- ' + playerArray.length + ' steam accounts retrieved ----------');

                playerArray.forEach(function(player) {
                    VerifyTab.update({
                        updated: {
                            $ne: true
                        },
                        steamID: player['steamid']
                    }, {
                        $set: {
                            personaname: player['personaname'],
                            avatar: player['avatarfull'],
                            updated: true
                        }
                    }, function(vErr, vRes) {
                        if (vErr) {
                            console.log(vErr);
                        }
                        if (vRes === 0) {
                            Meteor.users.update({
                                "profile.updated": {
                                    $ne: true
                                },
                                "profile.steamID": player['steamid']
                            }, {
                                $set: {
                                    "profile.personaname": player['personaname'],
                                    "profile.avatar": player['avatarfull'],
                                    "profile.updated": true
                                }
                            }, function(uErr, uRes) {
                                if (uErr) {
                                    console.log(uErr);
                                }
                            });
                        }
                    });
                });
            } else {
                console.log('Error retrieving results from Steam');
            }
            console.log('---------- End of Retrieval ----------');
        });
    }
}, 5000);

SyncedCron.options = {
    log: true,
    collectionName: 'cronHistory',
    utc: false,
    collectionTTL: 172800
};

SyncedCron.add({
    name: 'Profile Update Job',
    schedule: function(parser) {
        return parser.cron('* * 0 * * *', true);
    },
    job: function() {

    }
});

SyncedCron.start()
