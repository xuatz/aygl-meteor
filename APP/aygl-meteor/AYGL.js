/*
======================================================================================================
Server Configurations
======================================================================================================
*/

le_web_address = '52.74.37.252:3000';
//le_web_address = '128.199.86.69:80';
le_web_address = 'localhost:3000';
//le_web_address = 'localhost:3050';
//le_web_address = '128.199.86.69:3050';

//=============================

if (Meteor.isServer) {
    if (MatchesCollection.find().count() === 0) {
        console.log('im inserting starting data');
        MatchesCollection.insert(
          { 
            "status" : "PU", 
            "result" : "D",
            "admin" : "moltencrap",
            "screenshotUrl" : "www.niceurl.com/huatah",
            "matchPlayerResults" : [
              {
              "username" : "moltencrap",
              "playerSlot" : "0",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "pikachu",
              "playerSlot" : "1",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "hamtaro",
              "playerSlot" : "2",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "kyubey",
              "playerSlot" : "3",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "Dendi",
              "playerSlot" : "4",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "itchyfishy",
              "playerSlot" : "5",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "wertyteddy",
              "playerSlot" : "6",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "banana",
              "playerSlot" : "7",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "tongkatali",
              "playerSlot" : "8",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              },
              {
              "username" : "mongyethewha",
              "playerSlot" : "9",
              "minScore" : "1000",
              "maxScore" : "3000",
              "score" : "2000"
              }
            ]
          }
        );
    }

    if (Games.find().count() === 0) {
        Games.insert({
            "draft": [{
                name: "itchyfishy",
                team: "radiant"
            }, {
                name: "ohmysai",
                team: "radiant",
            }, {
                name: "moltencrap",
                team: "radiant"
            }, {
                name: "user10",
                team: "dire"
            }, {
                name: "wertyteddy",
                team: "radiant"
            }, {
                name: "user11",
                team: "dire"
            }, {
                name: "breakthr",
                team: "radiant"
            }, {
                name: "user12",
                team: "dire"
            }, {
                name: "user13",
                team: "dire"
            }, {
                name: "user14",
                team: "dire"
            }],
            eligibleplayercount:8,
            "state": "hosted",
            "host": {
                "name": "le_random_player",
                "percentile": 77
            },
            "challengers": [{
                "name": "user10",
                "personaname":"persona1",
                "percentile": 55,
                "avatar":"http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/91/9130744dcfd7cc3f3fc4cfff50145aff87355b11_full.jpg"
            }, {
                "name": "user11",
                "personaname":"persona2",
                "percentile": 65,
                "avatar":"http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/91/9130744dcfd7cc3f3fc4cfff50145aff87355b11_full.jpg"
            }, {
                "name": "user12",
                "personaname":"persona3",
                "percentile": 75,
                "avatar":"http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/91/9130744dcfd7cc3f3fc4cfff50145aff87355b11_full.jpg"
            }, {
                "name": "user13",
                "personaname":"persona4",
                "percentile": 85,
                "avatar":"http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/91/9130744dcfd7cc3f3fc4cfff50145aff87355b11_full.jpg"
            }],
            "avatar": "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/91/9130744dcfd7cc3f3fc4cfff50145aff87355b11_full.jpg",
            "matchmaking_threshold": 30,
            "title": "Test Lobby for AYGL"
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

