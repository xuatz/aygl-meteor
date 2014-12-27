VerifyTab = new Mongo.Collection('vtab');

Router.route('/', function() {
    this.render('main');
});

Router.route('/verifiedsignup/', function() {
    var sig = encodeURI(this.params.query['s']) + '=';
    var routerObj = this;
    routerObj.render('loading');
    Meteor.call('checkValidSignup', sig, function(err, res) {
        if (!res) {
            //NOPES. Please Try again
            console.log(res);
            //TODO render NOPE PAGE!!!
        } else {
            //RENDER REGISTRATION PAGE
            registeringNow = Meteor.subscribe('registeringPlayers', sig);
            routerObj.layout('verifiedsignup1', {
                data: function() {
                    var returnme = {
                        identity: res,
                        sig: sig
                    };
                    return returnme;
                }
            });
            routerObj.render('verifiedsignupinfo', {
                to: 'info'
            });
            routerObj.render('verifiedsignupform', {
                to: 'form'
            });
        }
    });
});

Router.route('/signin', function() {
    var newparams = this.params.query;
    var newurl = 'https://steamcommunity.com/openid/login';
    var rinstance = this;
    var newlink = newurl + this.originalUrl;
    newlink = newlink.replace('id_res', 'check_authentication');
    HTTP.call('POST', newlink, function(err, res) {
        if (res.content.search('is_valid:true') !== -1) {
            //IS VALID
            VerifyTab.insert({
                steamID: newparams['openid.claimed_id'].substring(36, newparams['openid.claimed_id'].length),
                sig: encodeURI(newparams['openid.sig'])
            });
            rinstance.response.writeHead(301, {
                'Location': '/verifiedsignup/?s=' + newparams['openid.sig']
            });
            rinstance.response.end();
        } else {
            //IS INVALID. display evil messages for the bad boys.
            rinstance.response.end('bad boys is bad. die bad boys!');
        }
    });
}, {
    where: 'server'
});



if (Meteor.isClient) {
    Template.main.helpers({
        steamloginlink: function() {
            var url = 'https://steamcommunity.com/openid/login?openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.realm=http://localhost:3000/&openid.return_to=http://localhost:3000/signin/';

            return url;

        }
    });
    Template.verifiedsignupinfo.helpers({
        idty: function() {
            return VerifyTab.findOne();
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
        Meteor.publish('registeringPlayers', function(sig) {
            return VerifyTab.find({
                sig: sig
            });
        });
    });

    Meteor.setInterval(function() {
        var STEAMKEY = '1E6F8CF6D531EB7ACD9AF9F08C41F02B';
        var api_steam_playerSummary = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + STEAMKEY;
        var playersToRetrieve = VerifyTab.find({
            updated: {
                $ne: true
            }
        }, {
            fields: {
                steamID: 1
            },
            limit: 100
        }).fetch();
        var steamIDs;
        var doRetrieve = false;
        if (playersToRetrieve.length >= 1) {
            doRetrieve = true;
            steamIDs = playersToRetrieve[0]['steamID'];
        }
        if (playersToRetrieve.length > 1) {
            for (var i = 1; i < playersToRetrieve.length; i++) {
                steamIDs = steamIDs + ',' + playersToRetrieve[i]['steamID'];
            }
        }
        if (doRetrieve) {
            var url = api_steam_playerSummary + '&steamids=' + steamIDs;
            HTTP.call('GET', url, function(err, res) {
                var playerArray = res.data.response.players;
                for (var j = playerArray.length - 1; j >= 0; j--) {
                    VerifyTab.update(playersToRetrieve[j], {
                        $set: {
                            personaname: playerArray[j]['personaname'],
                            avatar: playerArray[j]['avatarfull'],
                            updated: true
                        }
                    });
                };
                console.log(playerArray.length + ' players retrieved from Steam.');
            });
        }
    }, 5000);

    Meteor.methods({
        checkValidSignup: function(siggy) {
            if (VerifyTab.findOne({
                    sig: siggy
                }) === undefined) {
                return false;
            } else {
                return VerifyTab.findOne({
                    sig: siggy
                });
            }
        }
    });
}
