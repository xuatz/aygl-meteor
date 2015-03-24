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

VerifyTab = new Mongo.Collection('vtab');
Games = new Mongo.Collection('games');
Alerts = new Mongo.Collection('alerts');

MatchesCollection = new Mongo.Collection("Match");

MatchesCollection.allow({
    // insert:function(){return true;},
    remove:function(){return true;},
    update:function(){return true;},
});
