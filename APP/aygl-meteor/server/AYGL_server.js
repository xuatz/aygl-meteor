var crypto = Npm.require('crypto');

/*
======================================================================================================
Error Definitions for Main Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/
main_error_001_INVALID_ALERT = new Meteor.Error('main_err_001', 'Failed to handle alert. Invalid.');
main_error_002_CLIENT_ALERT_CREATE_DENY = new Meteor.Error('main_err_002', 'Clients are not allowed to create alerts!');

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
    Allows users to read and access alerts which belong to them
*/
Meteor.publish('myalerts', function() {
    if (this.userId) {
        var result = Alerts.find({
            recipient: Meteor.users.findOne({
                _id: this.userId
            }).username
        }, {
            limit: 30,
            sort: {
                date: -1
            }
        });
        return result;
    }
});

Meteor.methods({
    asdklasdg: function() {
        Meteor.users.update(
            {
               username: 'moltencrap'
            },
            {
                $set: {
                    'profile.privateData.playerStats.minScore': 4000,
                    'profile.privateData.playerStats.maxScore': 6000,
                    'profile.privateData.playerStats.score': 5000
                }
            }
        );
    },
    crazy2: function() {
        var user =
        Meteor.users.findOne();

        logger.debug(user);
        logger.debug(user.profile.privateData);
    }
});

/*
======================================================================================================
Server Main Methods
======================================================================================================
*/

getUsernameByUserId = function(userId) {
    var username = Meteor.users.findOne({_id: userId}).username;
    if (!username) {
        throw Error("No user found");
    } else {
        return username;
    }
}

getUserByUserId = function(userId) {
    return Meteor.users.findOne({_id: userId});
}

ayglHash = function(header, payload) {
    var password = header + payload;

    var salt = process.env.HASH_SALT;
    var iterations = parseInt(process.env.HASH_ITERATIONS);
    var keylen = parseInt(process.env.HASH_KEYLEN);

    return crypto.pbkdf2Sync(password, salt, iterations, keylen).toString('base64');
}

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
        logger.debug('---------- Account Retrieval Start ----------');
        logger.debug(playersToUpdate.length + ' profile refreshes');
        logger.debug(playersToRetrieve.length + ' registration verifications');
        var url = api_steam_playerSummary + '&steamids=' + steamIDs;
        var registerCount = 0;
        var userCount = 0;

        HTTP.call('GET', url, function(err, res) {
            if (res !== null) {
                var playerArray = res.data.response.players;
                logger.debug('---------- ' + playerArray.length + ' steam accounts retrieved ----------');

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
                            logger.debug(vErr);
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
                                    logger.debug(uErr);
                                }
                            });
                        }
                    });
                });
            } else {
                logger.debug('Error retrieving results from Steam');
            }
            logger.debug('---------- End of Retrieval ----------');
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
