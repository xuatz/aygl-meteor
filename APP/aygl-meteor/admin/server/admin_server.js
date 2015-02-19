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
		//TODO get stuff from MainDB
		matches: [{	"aygl_match_id" : "123", 
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

		//TODO put stuff in mongo
		MatchesPendingUpdate.insert(matches);
	}
});