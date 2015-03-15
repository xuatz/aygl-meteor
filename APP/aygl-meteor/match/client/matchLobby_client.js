
Template.matchradiant.helpers({
    demoMatchDetails: function() {
    	console.log('hi1');

    	var data = Meteor.call('demoMatchDetailsMethod', function(err, res) {
    		if (!err) {
    			console.log(res);
    			
    			return res;		
    		}
    	});
    },
    demoPlayer: function() {
    	console.log('hi1');

    	var data = Meteor.call('demoMatchDetailsMethod', function(err, res) {
    		if (!err) {
    			var something = res;

    			var a = 'huat';

    			something.forEach(function (item, index, array) {
		            console.log(item.status);
		            a = item.matchPlayerResultArr[0];
		        });
    			console.log(a);

    			return a.username;
    		}
    	});
    }
});