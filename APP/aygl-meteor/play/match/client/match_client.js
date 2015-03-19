Meteor.subscribe('MatchesCollection');

Template.matchradiant.helpers({
    demo18: function() {
        return {'username': 'huatah'};
    },
    demo2000: function() {
        var m = MatchesCollection.findOne();

        console.log(m);
        console.log(m.result);

        return m;
    },
    getPlayerDetails: function(playerSlot) {
        var data = Meteor.call('demoMatchDetailsMethod', function(err, res) {
            if (!err) {
                var list = res.matchPlayerResultArr;
                var item = list[playerSlot];

                // console.log(res);
                // console.log(list);
                // console.log(item);
                
                console.log(item.username);

                return item;
            }
        });
    },
    getRadPlayers: function() {
        var data = MatchesCollection.findOne();

        var radPlayers = _.filter(data.matchPlayerResultArr, 
            function(player_slot) { 
                return player_slot.player_slot < 5; 
            }
        );

        var radPlayers = _.sortBy(radPlayers, function(item)
            { return Math.sin(item.player_slot); }
        );

        console.log('radPlayers: ' + radPlayers);

        console.log('radPlayers: ' + radPlayers[0].username);

        return radPlayers;
    },
    getDirePlayers: function() {
        var data = MatchesCollection.findOne();

        console.log(data.matchPlayerResultArr);

        var radPlayers = _.filter(data.matchPlayerResultArr, 
            function(player_slot) { 
                return player_slot.player_slot > 4; 
            }
        );

        var radPlayers = _.sortBy(radPlayers, function(item)
            { return Math.sin(item.player_slot); }
        );

        console.log(radPlayers);

        return radPlayers;
    }
});



Template.demo1.events({
    'click #huatah' : function(event) {
        console.log('its me, huatah');

        bootbox.prompt({
            title: "Comments for " + this.name,
            callback: function(result) {
                if (result === null) {
                    console.log('he left nothing');
                } else {
                    console.log('are you sure?');
                }
            }
        });
    }
});