/*
======================================================================================================
Error Definitions for Signup Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/


/*
======================================================================================================
Server Methods
Methods used by during the Signup process will be placed here
======================================================================================================
*/

//TODO setup a hourly "cron job"?? to fetch list of matches pending update

Meteor.methods({
	retrieveMatchesPendingUpdateFromMainDB: function() {
		console.log('im in retrieveMatchesPendingUpdateFromMainDB');
		//TODO get stuff from MainDB
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
					"updated_dttm" : "20150101"}]

		//TODO delete MatchesPendingUpdate
		MatchesPendingUpdate.remove({});

		MatchesPendingUpdate.insert(
			{ "aygl_match_id" : "8800",
			"status" : "PU"}
		);
		MatchesPendingUpdate.insert(
			{ "aygl_match_id" : "8800",
			"status" : "PU"}
		);
		MatchesPendingUpdate.insert(
			{ "aygl_match_id" : "8800",
			"status" : "PU"}
		);
		MatchesPendingUpdate.insert(
			{ "aygl_match_id" : "8800",
			"status" : "PU"}
		);

		//TODO put stuff in mongo
		//fail to insert list of objects
		//MatchesPendingUpdate.insert(matches);



		var sometghing = MatchesPendingUpdate.find({});

		console.log('size2: ' + sometghing.count());
		console.log('test: ' + sometghing.fetch()[0].status);

		console.log('end of retrieveMatchesPendingUpdateFromMainDB');
	}
});