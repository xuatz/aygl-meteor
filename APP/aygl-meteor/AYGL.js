VerifyTab = new Mongo.Collection('vtab');
le_web_address = '128.199.86.69:3001';
asdasd
asdasd
asdasddasd
asdasdkjdasd
sgdfsgdfg
dfg
dfg
dfgdfdg

if (Meteor.isClient) {
    Template.mainregister.helpers({
        steamloginlink: function() {
            var url = 'https://steamcommunity.com/openid/login?openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.realm=http://'+le_web_address+'/&openid.return_to=http://'+le_web_address+'/signin/';

            return url;

        }
    });

    Template.mainloggedin.helpers({
        username: function() {
            if (Meteor.user()) {
                return Meteor.user().username;
            }
        }
    });

    Template.mainlogoutbutton.events({
        'click #logoutbtn': function(evt) {
            evt.preventDefault();
            Meteor.logout();
        }
    });

    Template.main.events({
        'click #loginsubmit, submit': function(evt) {
            evt.preventDefault();
            var username = Template.instance().find('#loginuser').value;
            var password = Template.instance().find('#loginpass').value;
            Meteor.loginWithPassword(username, password, function(error) {
                if (error) {
                    alert(error);
                } else {
                    Router.go('/home');
                }
            });
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {

        //Allow users to find their own temporary profiles during registration
        Meteor.publish('registeringPlayers', function(sig) {
            return VerifyTab.find({
                sig: sig
            });
        });


    });

    /*
    Polls the Steam API every 5 seconds for missing information in the temporary VerifyTab collection if 
    there are updated flags which are set to false (outdated) or do not exist (new) entries.
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
}
