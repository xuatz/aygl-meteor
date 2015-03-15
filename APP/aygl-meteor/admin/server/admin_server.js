var crypto = Npm.require('crypto');
var rest = Meteor.npmRequire('restler');

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

var matches = [
				{	
					"status" : "PU", 
					"result" : "D",
					"admin" : "moltencrap",
					"screenshotUrl" : "www.niceurl.com/huatah",
					"matchPlayerResultArr" : [
						{
						"username" : "player1",
						"player_slot" : "0",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player2",
						"player_slot" : "1",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player3",
						"player_slot" : "2",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player4",
						"player_slot" : "3",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player5",
						"player_slot" : "4",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player6",
						"player_slot" : "5",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player7",
						"player_slot" : "6",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player8",
						"player_slot" : "7",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player9",
						"player_slot" : "8",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						},
						{
						"username" : "player10",
						"player_slot" : "9",
						"minScore" : "1000",
						"maxScore" : "3000",
						"score" : "2000"
						}
					]
				}
			];

Meteor.methods({
	testMethod: function() {
		console.log('test start');
            
        //var password = JSON.stringify(matches);
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
                , params: {matchDetails: matches}
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

		

		//MatchesCollection.remove({});

		if (MatchesCollection.find().count() === 0) {
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