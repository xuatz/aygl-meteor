/*
======================================================================================================
Server Configurations
======================================================================================================
*/

le_web_address = 'localhost:3000'; //for local
//le_web_address = 'localhost:3050';
//le_web_address = '52.74.37.252:3000'; //for SIT
//le_web_address = '128.199.86.69:80'; //for PRD

//=============================

if (Meteor.isServer) {
    MatchesCollection.remove({});
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
                "minScore" : "1000",
                "username" : "moltencrap",
                "playerSlot" : 0,
                "maxScore" : 3000,
                "score" : 2000
              },
              {
              "username" : "pikachu",
              "playerSlot" : 1,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "hamtaro",
              "playerSlot" : 2,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "kyubey",
              "playerSlot" : 3,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "Dendi",
              "playerSlot" : 4,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "itchyfishy",
              "playerSlot" : 5,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "wertyteddy",
              "playerSlot" : 6,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "bananafritters",
              "playerSlot" : 7,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "tongkatali",
              "playerSlot" : 8,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              },
              {
              "username" : "mongyethewha",
              "playerSlot" : 9,
              "minScore" : 1000,
              "maxScore" : 3000,
              "score" : 2000
              }
            ]
          }
        );
    }
    var m = MatchesCollection.findOne();
    console.log(m);

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

/**
 * PLACEHOLDER METEORDOC MESSAGE BY XUATZ
 */
logger = new function() {
  var insertMessage = function(type, message, printConsole) {
    if (printConsole) {
      //TODO check if typesafe
      console.log(message);
    }

    var username;
    if (Meteor.user()) {
      username = Meteor.user().username;
    }

    MyLogger.insert({
      type: type,
      message: message,
      username: username
    });
  };


  /**
   * PLACEHOLDER METEORDOC MESSAGE BY XUATZ
   */

  this.debug = function (message) {
    insertMessage("debug", message, true);
  };

  this.debug = function (message, console) {
    insertMessage("debug", message, console);
  };

  this.info = function (message) {
    insertMessage("info", message, true);
  };

  this.info = function (message, console) {
    insertMessage("info", message, console);
  };

  this.warning = function (message) {
    insertMessage("warning", message, true);
  };

  this.warning = function (message, console) {
    insertMessage("warning", message, console);
  };

  this.error = function (message) {
    insertMessage("error", message, true);
  };

  this.error = function (message, console) {
    insertMessage("error", message, console);
  };
}

/*
======================================================================================================
Prototypes for Mongo Collections
======================================================================================================
*/

dota2assets = new function () {
  this.heroes =
    {
      ancient_apparition : {
        name: "Ancient Apparition",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/ancient_apparition_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/ancient_apparition_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/ancient_apparition_vert.jpg"
      },
      antimage : {
        name: "Anti-Mage",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/antimage_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/antimage_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/antimage_vert.jpg"
      },
      axe : {
        name: "Axe",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/axe_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/axe_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/axe_vert.jpg"
      },
      bane : {
        name: "Bane",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/bane_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/bane_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/bane_vert.jpg"
      },
      batrider : {
        name: "Batrider",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/batrider_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/batrider_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/batrider_vert.jpg"
      },
      beastmaster : {
        name: "Beastmaster",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/beastmaster_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/beastmaster_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/beastmaster_vert.jpg"
      },
      bloodseeker : {
        name: "Bloodseeker",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/bloodseeker_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/bloodseeker_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/bloodseeker_vert.jpg"
      },
      bounty_hunter : {
        name: "Bounty Hunter",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/bounty_hunter_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/bounty_hunter_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/bounty_hunter_vert.jpg"
      },
      brewmaster : {
        name: "Brewmaster",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/brewmaster_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/brewmaster_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/brewmaster_vert.jpg"
      },
      bristleback : {
        name: "Bristleback",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/bristleback_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/bristleback_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/bristleback_vert.jpg"
      },
      broodmother : {
        name: "Broodmother",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/broodmother_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/broodmother_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/broodmother_vert.jpg"
      },
      centaur : {
        name: "Centaur Warrunner",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/centaur_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/centaur_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/centaur_vert.jpg"
      },
      chaos_knight : {
        name: "Chaos Knight",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/chaos_knight_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/chaos_knight_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/chaos_knight_vert.jpg"
      },
      chen : {
        name: "Chen",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/chen_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/chen_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/chen_vert.jpg"
      },
      clinkz : {
        name: "Clinkz",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/clinkz_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/clinkz_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/clinkz_vert.jpg"
      },
      clockwerk : {
        name: "Clockwerk",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/clockwerk_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/clockwerk_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/clockwerk_vert.jpg"
      },
      crystal_maiden : {
        name: "Crystal Maiden",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/crystal_maiden_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/crystal_maiden_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/crystal_maiden_vert.jpg"
      },
      dark_seer : {
        name: "Dark Seer",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/dark_seer_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/dark_seer_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/dark_seer_vert.jpg"
      },
      dazzle : {
        name: "Dazzle",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/dazzle_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/dazzle_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/dazzle_vert.jpg"
      },
      death_prophet : {
        name: "Death Prophet",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/death_prophet_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/death_prophet_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/death_prophet_vert.jpg"
      },
      disruptor : {
        name: "Disruptor",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/disruptor_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/disruptor_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/disruptor_vert.jpg"
      },
      doom : {
        name: "Doom",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/doom_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/doom_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/doom_vert.jpg"
      },
      dragon_knight : {
        name: "Dragon Knight",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/dragon_knight_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/dragon_knight_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/dragon_knight_vert.jpg"
      },
      drow_ranger : {
        name: "Drow Ranger",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/drow_ranger_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/drow_ranger_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/drow_ranger_vert.jpg"
      },
      earth_spirit : {
        name: "Earth Spirit",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/earth_spirit_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/earth_spirit_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/earth_spirit_vert.jpg"
      },
      earthshaker : {
        name: "Earthshaker",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/earthshaker_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/earthshaker_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/earthshaker_vert.jpg"
      },
      elder_titan : {
        name: "Elder Titan",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/elder_titan_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/elder_titan_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/elder_titan_vert.jpg"
      },
      ember_spirit : {
        name: "Ember Spirit",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/ember_spirit_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/ember_spirit_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/ember_spirit_vert.jpg"
      },
      enchantress : {
        name: "Enchantress",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/enchantress_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/enchantress_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/enchantress_vert.jpg"
      },
      enigma : {
        name: "Enigma",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/enigma_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/enigma_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/enigma_vert.jpg"
      },
      faceless_void : {
        name: "Faceless Void",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/faceless_void_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/faceless_void_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/faceless_void_vert.jpg"
      },
      gyrocopter : {
        name: "Gyrocopter",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/gyrocopter_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/gyrocopter_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/gyrocopter_vert.jpg"
      },
      huskar : {
        name: "Huskar",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/huskar_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/huskar_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/huskar_vert.jpg"
      },
      invoker : {
        name: "Invoker",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/invoker_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/invoker_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/invoker_vert.jpg"
      },
      io : {
        name: "Io",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/io_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/io_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/io_vert.jpg"
      },
      jakiro : {
        name: "Jakiro",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/jakiro_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/jakiro_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/jakiro_vert.jpg"
      },
      juggernaut : {
        name: "Juggernaut",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/juggernaut_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/juggernaut_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/juggernaut_vert.jpg"
      },
      keeper_of_the_light : {
        name: "Keeper of the Light",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/keeper_of_the_light_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/keeper_of_the_light_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/keeper_of_the_light_vert.jpg"
      },
      kunkka : {
        name: "Kunkka",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_vert.jpg"
      },
      legion_commander : {
        name: "Legion Commander",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/legion_commander_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/legion_commander_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/legion_commander_vert.jpg"
      },
      leshrac : {
        name: "Leshrac",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/leshrac_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/leshrac_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/leshrac_vert.jpg"
      },
      lich : {
        name: "Lich",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/lich_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/lich_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/lich_vert.jpg"
      },
      lifestealer : {
        name: "Lifestealer",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/lifestealer_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/lifestealer_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/lifestealer_vert.jpg"
      },
      lina : {
        name: "Lina",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/lina_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/lina_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/lina_vert.jpg"
      },
      lion : {
        name: "Lion",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/lion_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/lion_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/lion_vert.jpg"
      },
      lone_druid : {
        name: "Lone Druid",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/lone_druid_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/lone_druid_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/lone_druid_vert.jpg"
      },
      luna : {
        name: "Luna",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/luna_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/luna_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/luna_vert.jpg"
      },
      lycan : {
        name: "Lycan",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/lycan_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/lycan_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/lycan_vert.jpg"
      },
      magnus : {
        name: "Magnus",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/magnus_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/magnus_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/magnus_vert.jpg"
      },
      medusa : {
        name: "Medusa",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/medusa_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/medusa_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/medusa_vert.jpg"
      },
      meepo : {
        name: "Meepo",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/meepo_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/meepo_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/meepo_vert.jpg"
      },
      mirana : {
        name: "Mirana",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/mirana_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/mirana_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/mirana_vert.jpg"
      },
      morphling : {
        name: "Morphling",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/morphling_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/morphling_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/morphling_vert.jpg"
      },
      naga_siren : {
        name: "Naga Siren",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/naga_siren_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/naga_siren_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/naga_siren_vert.jpg"
      },
      furion : {
        name: "Nature's Prophet",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/furion_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/furion_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/furion_vert.jpg"
      },
      necrolyte : {
        name: "Necrophos",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/necrolyte_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/necrolyte_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/necrolyte_vert.jpg"
      },
      night_stalker : {
        name: "Night Stalker",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/night_stalker_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/night_stalker_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/night_stalker_vert.jpg"
      },
      nyx_assassin : {
        name: "Nyx Assassin",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/nyx_assassin_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/nyx_assassin_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/nyx_assassin_vert.jpg"
      },
      orge_magi : {
        name: "Orge Magi",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/orge_magi_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/orge_magi_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/orge_magi_vert.jpg"
      },
      omniknight : {
        name: "Omniknight",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/omniknight_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/omniknight_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/omniknight_vert.jpg"
      },
      oracle : {
        name: "Oracle",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/oracle_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/oracle_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/oracle_vert.jpg"
      },
      obsidian_destroyer : {
        name: "Outworld Devourer",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/obsidian_destroyer_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/obsidian_destroyer_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/obsidian_destroyer_vert.jpg"
      },
      phantom_assassin : {
        name: "Phantom Assassin",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/phantom_assassin_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/phantom_assassin_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/phantom_assassin_vert.jpg"
      },
      phantom_lancer : {
        name: "Phantom Lancer",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/phantom_lancer_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/phantom_lancer_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/phantom_lancer_vert.jpg"
      },
      phoenix : {
        name: "Phoenix",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/phoenix_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/phoenix_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/phoenix_vert.jpg"
      },
      puck : {
        name: "Puck",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/puck_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/puck_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/puck_vert.jpg"
      },
      pudge : {
        name: "Pudge",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/pudge_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/pudge_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/pudge_vert.jpg"
      },
      pugna : {
        name: "Pugna",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/pugna_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/pugna_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/pugna_vert.jpg"
      },
      queen_of_pain : {
        name: "Queen of Pain",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/queen_of_pain_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/queen_of_pain_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/queen_of_pain_vert.jpg"
      },
      razor : {
        name: "Razor",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/razor_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/razor_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/razor_vert.jpg"
      },
      riki : {
        name: "Riki",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/riki_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/riki_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/riki_vert.jpg"
      },
      rubick : {
        name: "Rubick",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/rubick_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/rubick_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/rubick_vert.jpg"
      },
      sand_king : {
        name: "Sand King",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/sand_king_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/sand_king_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/sand_king_vert.jpg"
      },
      shadow_demon : {
        name: "Shadown Demon",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_demon_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_demon_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_demon_vert.jpg"
      },
      shadow_fiend : {
        name: "Shadow Fiend",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_fiend_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_fiend_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_fiend_vert.jpg"
      },
      shadow_shaman : {
        name: "Shadow Shaman",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_shaman_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_shaman_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/shadow_shaman_vert.jpg"
      },
      silencer : {
        name: "Silencer",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/silencer_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/silencer_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/silencer_vert.jpg"
      },
      skywrath_mage : {
        name: "Skywrath Mage",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/skywrath_mage_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/skywrath_mage_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/skywrath_mage_vert.jpg"
      },
      slardar : {
        name: "Slardar",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/slardar_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/slardar_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/slardar_vert.jpg"
      },
      slark : {
        name: "Slark",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/slark_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/slark_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/slark_vert.jpg"
      },
      sniper : {
        name: "Sniper",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/sniper_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/sniper_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/sniper_vert.jpg"
      },
      spectre : {
        name: "Spectre",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/spectre_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/spectre_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/spectre_vert.jpg"
      },
      spirit_breaker : {
        name: "Spirit Breaker",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/spirit_breaker_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/spirit_breaker_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/spirit_breaker_vert.jpg"
      },
      storm_spirit : {
        name: "Storm Spirit",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/storm_spirit_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/storm_spirit_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/storm_spirit_vert.jpg"
      },
      sven : {
        name: "Sven",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/sven_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/sven_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/sven_vert.jpg"
      },
      techies : {
        name: "Techies",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/techies_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/techies_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/techies_vert.jpg"
      },
      templar_assassin : {
        name: "Templar Assassin",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/templar_assassin_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/templar_assassin_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/templar_assassin_vert.jpg"
      },
      terrorblade : {
        name: "Terrorblade",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/terrorblade_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/terrorblade_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/terrorblade_vert.jpg"
      },
      tidehunter : {
        name: "Tidehunter",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/tidehunter_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/tidehunter_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/tidehunter_vert.jpg"
      },
      timbersaw : {
        name: "Timbersaw",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/timbersaw_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/timbersaw_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/timbersaw_vert.jpg"
      },
      tinker : {
        name: "Tinker",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/tinker_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/tinker_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/tinker_vert.jpg"
      },
      tiny : {
        name: "Tiny",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/tiny_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/tiny_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/tiny_vert.jpg"
      },
      treant_protector : {
        name: "Treant Protector",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/treant_protector_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/treant_protector_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/treant_protector_vert.jpg"
      },
      troll_warlord : {
        name: "Troll Warlord",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/troll_warlord_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/troll_warlord_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/troll_warlord_vert.jpg"
      },
      tusk : {
        name: "Tusk",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/tusk_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/tusk_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/tusk_vert.jpg"
      },
      undying : {
        name: "Undying",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/undying_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/undying_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/undying_vert.jpg"
      },
      ursa : {
        name: "Ursa",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/ursa_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/ursa_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/ursa_vert.jpg"
      },
      vengeful_spirit : {
        name: "Vengeful Spirit",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/vengeful_spirit_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/vengeful_spirit_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/vengeful_spirit_vert.jpg"
      },
      venomancer : {
        name: "Venomancer",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/venomancer_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/venomancer_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/venomancer_vert.jpg"
      },
      viper : {
        name: "Viper",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/viper_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/viper_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/viper_vert.jpg"
      },
      visage : {
        name: "Visage",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/visage_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/visage_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/visage_vert.jpg"
      },
      warlock : {
        name: "Warlock",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/warlock_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/warlock_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/warlock_vert.jpg"
      },
      weaver : {
        name: "Weaver",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/weaver_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/weaver_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/weaver_vert.jpg"
      },
      windrunner : {
        name: "Windranger",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/windrunner_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/windrunner_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/windrunner_vert.jpg"
      },
      winter_wyvern : {
        name: "Winter Wyvern",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/winter_wyvern_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/winter_wyvern_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/winter_wyvern_vert.jpg"
      },
      witch_doctor : {
        name: "Witch Doctor",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/witch_doctor_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/witch_doctor_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/witch_doctor_vert.jpg"
      },
      skeleton_king : {
        name: "Wraith King",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/skeleton_king_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/skeleton_king_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/skeleton_king_vert.jpg"
      },
      zuus : {
        name: "Zeus",
        landscape_hover: "http://cdn.dota2.com/apps/dota2/images/heroes/zuus_hphover.png",
        landscape_full: "http://cdn.dota2.com/apps/dota2/images/heroes/zuus_full.png",
        port_vert: "http://cdn.dota2.com/apps/dota2/images/heroes/zuus_vert.jpg"
      }
    }
  ;
}

roleList = {
  mid: "Mid",
  tempoMid: "Tempo Mid",
  farmingMid: "Farming Mid",
  offlane: "Offlane",
  carry: "Carry",
  greedyCarry: "Greedy Carry",
  roamingCarry: "Roaming Carry",
  support: "Support",
  greedySupport: "Greedy Support",
  roamingSupport: "Roaming Support",
  defensiveSupport: "Defensive Support",
  pos6support: "Position 6 Support"
};

var arr = [];

_.each(dota2assets.heroes, function(item) {
  this.key
  // console.log(item);
  var title = item.name;
  arr.push(
    {
      label: item.name,
      value: item.name
    }
  );
});

// console.log(arr);

var heroList = arr;

Schemas = {};

Schemas.MatchmakingRole = new SimpleSchema({
  role1: {
      type: String,
      label: "Role 1",
      autoform: {
          options: roleList
      },
      optional: true
  },
  role2: {
      type: String,
      label: "Role 2",
      autoform: {
          options: roleList
      },
      optional: true
  },
  role3: {
      type: String,
      label: "Role 3",
      autoform: {
          options: roleList
      },
      optional: true
  }
});

Schemas.MatchmakingHero = new SimpleSchema({
  hero1: {
      type: String,
      label: "Hero 1",
      autoform: {
          options: heroList
      },
      optional: true
  },
  hero2: {
      type: String,
      label: "Hero 2",
      autoform: {
          options: heroList
      },
      optional: true
  },
  hero3: {
      type: String,
      label: "Hero 3",
      autoform: {
          options: heroList
      },
      optional: true
  }
});

Schemas.ProfileMatchmaking = new SimpleSchema({
  preferred_role: {
      type: Schemas.MatchmakingRole,
      optional: true
  },
  preferred_hero: {
      type: Schemas.MatchmakingHero,
      optional: true
  }
});

// Schemas.UserProfile = new SimpleSchema({
//   steamID: {
//     type: String,
//     optional: true
//   },
//   personaname: {
//     type: String,
//     optional: true
//   },
//   avatar: {
//     type: String,
//     optional: true
//   },
//   hash: {
//     type: String,
//     optional: true
//   },
//   matchmaking: {
//       type: Schemas.ProfileMatchmaking,
//       optional: true
//   },
//   ranking: {
//     type: Object,
//     optional: true
//   },
//   // "ranking.$.rank": {
//   //   type: String,
//   //   optional: true
//   // },
//   // "ranking.$.percentile": {
//   //   type: Number,
//   //   optional: true
//   // },
//   privateData: {
//     type: Object,
//     optional: true
//   },
//   "privateData.$.playerStats": {
//     type: [Object],
//     optional: true
//   },
//   "privateData.$.playerStats.$.minScore": {
//     type: Number,
//     optional: true
//   },
//   "privateData.$.playerStats.$.maxScore": {
//     type: Number,
//     optional: true
//   },
//   updated: {
//     type: String,
//     optional: true
//   },
//   state: {
//     type: String,
//     optional: true
//   },
//   room: {
//     type: String,
//     optional: true
//   },
// });
//
// Schemas.User = new SimpleSchema({
//   username: {
//     type: String,
//     optional: true
//   },
//   password: {
//     type: Object,
//     optional: true,
//     blackbox: true
//   },
//   email: {
//     type: String,
//     optional: true
//   },
//   profile: {
//     type: Schemas.UserProfile,
//     optional: true
//   },
//   status: {
//     type: Object,
//     optional: true,
//     blackbox: true
//   }
// });

//Meteor.users.attachSchema(Schemas.User);
