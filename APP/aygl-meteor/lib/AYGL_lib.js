/*
======================================================================================================
What is this file for?

This file is loaded before ANY OTHER files in this directory (even before client/server). Therefore,
any code/variables which need to be declared and later used by client/server can be located here.
======================================================================================================
*/

/*
======================================================================================================
MongoDB Collections
Below are the MongoDB Collections which will be used by this app.
======================================================================================================
*/

Meteor.startup(function () {
  if (Meteor.isServer) {
    //process.env.MAIL_URL = 'smtp://postmaster%40meteorize.mailgun.org:YOURPASSWORD@smtp.mailgun.org:587';
    process.env.HASH_SALT = 'byvGX7KLa4';
    process.env.HASH_ITERATIONS = 2;
    process.env.HASH_KEYLEN = 128;

    //TODO replace with real IP
    process.env.MAIN_DB_URL = 'localhost:3000';
  }
});

VerifyTab = new Mongo.Collection('vtab');
Games = new Mongo.Collection('games');
Alerts = new Mongo.Collection('alerts');
MatchesCollection = new Mongo.Collection("Match");

MatchesCollection.allow({
    insert:function(){return true;},
    // remove:function(){return true;},
    update:function(){return true;},
});

PlayerReview = new Mongo.Collection("PlayerReview");

MyLogger = new Mongo.Collection('MyLogger');

MyLogger.allow({
    insert:function(){return true;}
});

// PlayerReview.allow({
//     insert:function(){return true;},
//     // remove:function(){return true;},
//     update:function(){return true;},
// });

//=================================

var beforeInsertOptions = function(username, doc) {
  doc.createdDttm = moment().format();
  doc.createdBy = username || "SYS";
};

var beforeUpdateOptions = function(username, doc, fieldNames, modifier, options){
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedDttm = moment().format();
  modifier.$set.updatedBy = username || "SYS";
};

//=================================

//XZ: i cant get the default.options to work =(

Games.before.insert(beforeInsertOptions);
Alerts.before.insert(beforeInsertOptions);
MatchesCollection.before.insert(beforeInsertOptions);
PlayerReview.before.insert(beforeInsertOptions);
MyLogger.before.insert(beforeInsertOptions);

Games.before.update(beforeUpdateOptions);
Alerts.before.update(beforeUpdateOptions);
MatchesCollection.before.update(beforeUpdateOptions);
PlayerReview.before.update(beforeUpdateOptions);
MyLogger.before.update(beforeUpdateOptions);
