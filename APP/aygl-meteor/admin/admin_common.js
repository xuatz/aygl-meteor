MatchesCollection = new Mongo.Collection("Match");

MatchesCollection.allow({
  	insert:function(){return true;},
  	remove:function(){return true;},
  	update:function(){return true;},
});