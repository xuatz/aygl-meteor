var crypto = Npm.require('crypto');

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

var match;

match = MatchesCollection.findOne();

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
		//XZ:19/03/15: does this guy even do anything?
	}
});

Meteor.publish("MatchesCollection", function () {
  	return MatchesCollection.find();
});