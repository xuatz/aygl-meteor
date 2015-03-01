/*
======================================================================================================
Server Configurations
======================================================================================================
*/

le_web_address = 'localhost:3000';
//le_web_address = '128.199.86.69:80';

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
                "percentile": 55
            }, {
                "name": "user11",
                "personaname":"persona2",
                "percentile": 65
            }, {
                "name": "user12",
                "personaname":"persona3",
                "percentile": 75
            }, {
                "name": "user13",
                "personaname":"persona4",
                "percentile": 85
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

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.MatchTable = new Tabular.Table({
    name: "MatchTable",
    collection: MatchesCollection,
    columns: [
        {data: "aygl_match_id", title: "Match ID"},
        {data: "status",        title: "Match Status"},
        {data: "created_dttm",  title: "Created Date/Time"},
        {data: "updated_dttm",  title: "Updated Date/Time"},
        {data: "admin_assigned_to",  title: "Assigned to"}
    ]
});


/*
======================================================================================================
Prototypes for Mongo Collections
======================================================================================================
*/

//FOR FUTURE USE

MatchPlayerResult = new SimpleSchema({
  username: {
    type: String,
    max: 25,
    label: "Username"
  },
  player_slot: {
    type: String,
    max: 2,
    label: "Player Slot"
  },
  noOfKill: {
    type: Number,
    label: "Number of Kills",
    optional: true
    // ,custom: function () {
    //     if (this.isUpdate) {
    //         return "required";
    //     }
    // }
  },
  noOfDeath: {
    type: Number,
    label: "Number of Deaths",
    optional: true
    // ,custom: function () {
    //     if (this.isUpdate) {
    //         return "required";
    //     }
    // }
  },
  noOfAssist: {
    type: Number,
    label: "Number of Assists",
    optional: true
    // ,custom: function () {
    //     if (this.isUpdate) {
    //         return "required";
    //     }
    // }
  }

  /*
    ,
  hero_id: {
    type: Number,
    max: 3,
    label: "Hero ID",
    optional: true
  },
  adjustment: {
    type: Number,
    label: "Score Adjustment",
    optional: true,
    defaultValue: "0"
  },
  createdAt: {
    type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date;
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date};
        } else {
          this.unset();
        }
      }
  },
  created_by: {
    type: String,
    label: "Created By",
    autoValue: function() {
        console.log('userId: ' + this.userId);
        return this.userId;
    }
  },
  // Force value to be current date (on server) upon update
  // and don't allow it to be set upon insert.
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
  updated_by: {
    type: String,
    label: "Updated By"
  }
  */
});

MatchesCollection.attachSchema(new SimpleSchema({
  aygl_match_id: {
    type: Number,
    label: "aygl_match_id",
    optional: true
  },
  dota_match_id: {
    type: Number,
    label: "dota_match_id",
    optional: true
  },
  status: {
    type: String,
    max: 4,
    label: "Status"
  },
  result: {
    type: String,
    max: 4,
    label: "Result",
    optional: true,
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Radiant Victory", value: "R"},
          {label: "Dire Victory", value: "D"},
          {label: "Match Voided", value: "V"}
        ];
      }
    }
  },
  admin_assigned_to: {
    type: String,
    max: 25,
    label: "Assigned To",
    optional: true
  },
  screenshot_url: {
    type: String,
    label: "Screenshot URL",
    optional: true
  },
  matchPlayerResultArr : {
    type: [MatchPlayerResult],
    label: "MatchPlayerResult Array"
  }
}));

