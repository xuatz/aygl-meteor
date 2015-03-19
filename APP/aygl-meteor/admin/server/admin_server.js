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
	testMethod: function() {
		console.log('test start');
            
        //var password = JSON.stringify(match);
        var password = '/match[object Object]';

        console.log('json: ' + password);

        var salt = "byvGX7KLa4";
        var iterations = 2;
        var keylen = 128;

        var sooo;

        var hash = crypto.pbkdf2Sync('/match[object Object]', salt, iterations, keylen).toString('base64');

        HTTP.call("POST", "http://localhost:3000/match",
            {
                headers: {
                    authorization: "aygldb " + hash
                }
                , params: {matchDetails: match}
            }, function(err, res) {
                if (res) {
                    console.log('huatah');
                    console.log('==================');
                    console.log(res);

                    return res;
                }
            }
        );
	},
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