/*
======================================================================================================
Server Configurations
======================================================================================================
*/

le_web_address = 'localhost:3000';

/*
======================================================================================================
MongoDB Collections
Below are the MongoDB Collections which will be used by this app.
======================================================================================================
*/

VerifyTab = new Mongo.Collection('vtab');
OnlinePlayers = new Mongo.Collection('onlineplayers');
Games = new Mongo.Collection('games');

if (Meteor.isServer) {
    if (Games.find().count() === 0) {
        Games.insert({
            "draft": {
                "radiant": ["itchyfishy", "moltencrap", "wertyteddy", "ohmysai", "BreakThr"],
                "dire": ["user1", "user2", "user3", "user4", "user5"]
            },
            "state": "hosted",
            "host": {
                "name": "itchyfishy",
                "percentile": 77
            },
            "challengers": [{
                "name":"user10",
                "percentile":55
            },{
                "name":"user11",
                "percentile":65
            },{
                "name":"user12",
                "percentile":75
            },{
                "name":"user13",
                "percentile":85
            }],
            "avatar" : "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/91/9130744dcfd7cc3f3fc4cfff50145aff87355b11_full.jpg",
            "matchmaking_threshold":30,
            "title":"Le Hard Code Test Lobby"
        });
    }
}

Meteor.users.deny({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});
/*
======================================================================================================
Prototypes for Mongo Collections
======================================================================================================
*/

//FOR FUTURE USE
