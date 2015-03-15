
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
	demoMatchDetailsMethod: function() {
		return matches;
	}
});

