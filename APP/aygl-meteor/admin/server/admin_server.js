/*
======================================================================================================
Module Variables
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/



/*
======================================================================================================
Error Definitions for Signup Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/


/*
======================================================================================================
Server Methods
======================================================================================================
*/


Meteor.methods({
	retrieveMatchesPendingUpdateFromMainDB: function() {
		MatchesCollection.remove({});

		var matches = [{	"aygl_match_id" : "123", 
					"status" : "PU", 
					"created_dttm" : "20150101", 
					"updated_dttm" : "20150101", 
					"admin_assigned_to" : "moltencrap"}
					,{	"aygl_match_id" : "222", 
					"status" : "PU", 
					"created_dttm" : "20150101", 
					"updated_dttm" : "20150101", 
					"admin_assigned_to" : "moltencrap"}
					,{	"aygl_match_id" : "333", 
					"status" : "PU", 
					"created_dttm" : "20150101", 
					"updated_dttm" : "20150101"}
					,{	"aygl_match_id" : "444", 
					"status" : "PU", 
					"created_dttm" : "20150101", 
					"updated_dttm" : "20150101"}];

		//var data = JSON.parse(matches);

		matches.forEach(function (item, index, array) {
            //MatchesPendingUpdate.insert(item);
            MatchesCollection.insert(item);
        });

        MatchesCollection.insert(
			{ "aygl_match_id" : "1000",
			"status" : "PU",
			"admin_assigned_to" : "moltencrap"}
		);
		MatchesCollection.insert(
			{ "aygl_match_id" : "1100",
			"status" : "PU",
			"admin_assigned_to" : "moltencrap"}
		);
		MatchesCollection.insert(
			{ "aygl_match_id" : "1200",
			"status" : "PU",
			"admin_assigned_to" : "moltencrap"}
		);
		MatchesCollection.insert(
			{ "aygl_match_id" : "1500",
			"status" : "PU",
			"admin_assigned_to" : "obama"}
		);

		var sometghing = MatchesCollection.find({});

		console.log('size2: ' + sometghing.count());
		console.log('test: ' + sometghing.fetch()[0].status);

		console.log('end of retrieveMatchesPendingUpdateFromMainDB');
	}
});