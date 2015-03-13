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
	getSelectedMatch: function(selectedMatchId) {
		console.log('selectedMatchId: '+ Meteor.user().profile.selectedMatchId);
        //var m = MatchesCollection.findOne(Meteor.user().profile.selectedMatchId);
        var m = MatchesCollection.findOne();

        console.log(m);

        return m;
	},
	updateSelectedMatchId: function(selectedMatchId) {
		console.log('=============');
		console.log('check selectedMatchId: ' + selectedMatchId)
		Meteor.users.update(
            {"_id" : this.userId}, 
            {
                $set : {
                    "profile.selectedMatchId" : selectedMatchId
                }
            }
		);
	},
	retrieveMatchesPendingUpdateFromMainDB: function() {
		//MatchesCollection.remove({});

		if (MatchesCollection.find().count() === 0) {
			var matches = [
				{	"aygl_match_id" : "123", 
					"status" : "PU", 
					"created_dttm" : "20150101", 
					"updated_dttm" : "20150101", 
					"admin_assigned_to" : "moltencrap",
					"matchPlayerResultArr" : [
						{
						"username" : "player1",
						"player_slot" : "0",
						},
						{
						"username" : "player2",
						"player_slot" : "1",
						},
						{
						"username" : "player3",
						"player_slot" : "2",
						},
						{
						"username" : "player4",
						"player_slot" : "3",
						},
						{
						"username" : "player5",
						"player_slot" : "4",
						},
						{
						"username" : "player6",
						"player_slot" : "5",
						},
						{
						"username" : "player7",
						"player_slot" : "6",
						},
						{
						"username" : "player8",
						"player_slot" : "7",
						},
						{
						"username" : "player9",
						"player_slot" : "8",
						},
						{
						"username" : "player10",
						"player_slot" : "9",
						}
					]
				}
			];



			//var data = JSON.parse(matches);

			matches.forEach(function (item, index, array) {
	            //MatchesPendingUpdate.insert(item);
	            MatchesCollection.insert(item);
	        });	
		}

		var sometghing = MatchesCollection.find({});

		console.log('size2: ' + sometghing.count());
		console.log('test: ' + sometghing.fetch()[0].status);

		console.log('end of retrieveMatchesPendingUpdateFromMainDB');
	}
});

Meteor.publish("MatchesCollection", function () {
  	return MatchesCollection.find();
});