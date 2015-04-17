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
        {data: "admin",  title: "Assigned to"}
    ]
});

//FOR FUTURE USE

MatchPlayerResult = new SimpleSchema({
  username: {
    type: String,
    max: 25,
    label: "Username"
  },
  playerSlot: {
    type: String,
    max: 2,
    label: "Player Slot"
  },
  adjustment: {
    type: Number,
    label: "Score Adjustment",
    optional: true
  }
});

MatchesCollection.attachSchema(new SimpleSchema({
  ayglMatchId: {
    type: Number,
    label: "AYGL Match ID",
    optional: true
  },
  dotaMatchId: {
    type: Number,
    label: "DOTA Match ID",
    optional: true
  },
  status: {
    type: String,
    max: 4,
    label: "Status",
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Pending Update", value: "PU"},
          {label: "Pending Investigation", value: "PI"},
        ];
      }
    }
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
  admin: {
    type: String,
    max: 25,
    label: "Assigned To",
    optional: true
  },
  screenshotUrl: {
    type: String,
    label: "Screenshot URL",
    optional: true
  },
  matchPlayerResults : {
    type: [MatchPlayerResult],
    label: "MatchPlayerResults"
  }
}));
