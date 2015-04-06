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

// MatchPlayerResult = new SimpleSchema({
//   username: {
//     type: String,
//     max: 25,
//     label: "Username"
//   },
//   playerSlot: {
//     type: String,
//     max: 2,
//     label: "Player Slot"
//   },
//   adjustment: {
//     type: Number,
//     label: "Score Adjustment",
//     optional: true,
//     defaultValue: "0"
//   },
//   // createdAt: {
//   //   type: Date,
//   //     autoValue: function() {
//   //       if (this.isInsert) {
//   //         return new Date;
//   //       } else if (this.isUpsert) {
//   //         return {$setOnInsert: new Date};
//   //       } else {
//   //         this.unset();
//   //       }
//   //     }
//   // },
//   // created_by: {
//   //   type: String,
//   //   label: "Created By",
//   //   autoValue: function() {
//   //       console.log('userId: ' + this.userId);
//   //       return this.userId;
//   //   }
//   // },
//   // // Force value to be current date (on server) upon update
//   // // and don't allow it to be set upon insert.
//   // updatedAt: {
//   //   type: Date,
//   //   autoValue: function() {
//   //     if (this.isUpdate) {
//   //       return new Date();
//   //     }
//   //   },
//   //   denyInsert: true,
//   //   optional: true
//   // },
//   // updated_by: {
//   //   type: String,
//   //   label: "Updated By"
//   // }
// });

MatchesCollection.attachSchema(new SimpleSchema({
  ayglMatchId: {
    type: Number,
    label: "aygl_match_id",
    optional: true
  },
  dotaMatchId: {
    type: Number,
    label: "dota_match_id",
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
  // matchPlayerResults : {
  //   type: [MatchPlayerResult],
  //   label: "MatchPlayerResults"
  // }
}));