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

//=================================

var beforeInsertOptions = function(username, doc) {
  //console.log('hi!! im in before insert!');
  doc.createdDttm = Date.now();
  doc.createdBy = username;
};

var beforeUpdateOptions = function(username, doc, fieldNames, modifier, options){
  // console.log('doc');
  // console.log(doc);
  // console.log('fieldNames');
  // console.log(fieldNames);
  // console.log('modifier');
  // console.log(modifier);

  modifier.$set = modifier.$set || {};
  modifier.$set.updatedDttm = Date.now();
  modifier.$set.updatedBy = username;
};

//=================================

//XZ: i cant get the default.options to work =(

Games.before.insert(beforeInsertOptions);
Alerts.before.insert(beforeInsertOptions);
MatchesCollection.before.insert(beforeInsertOptions);

Games.before.update(beforeUpdateOptions);
Alerts.before.update(beforeUpdateOptions);
MatchesCollection.before.update(beforeUpdateOptions);
