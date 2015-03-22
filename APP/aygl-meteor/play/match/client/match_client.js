Meteor.subscribe('MatchesCollection');

Template.matchradiant.helpers({
    getRadPlayers: function() {
        var data = MatchesCollection.findOne();

        // console.log('===================');
        // console.log(data);

        var radPlayers = _.filter(data.matchPlayerResults, 
            function(item) { 
                return item.playerSlot < 5; 
            }
        );

        var radPlayers = _.sortBy(radPlayers, function(item) { 
            return item.playerSlot; 
        });

        // console.log('radPlayers: ' + radPlayers);
        // console.log('radPlayers: ' + radPlayers[0].username);

        return radPlayers;
    }
});

Template.matchdire.helpers({
    getDirePlayers: function() {
        var data = MatchesCollection.findOne();

        // console.log('===== getDirePlayers!! ==============');
        // console.log(data);

        var players = _.filter(data.matchPlayerResults, 
            function(item) { 
                return item.playerSlot > 4; 
            }
        );

        var players = _.sortBy(players, function(item) { 
            return item.playerSlot;
        });

        return players;
    }
});

Template.matchlayout.events({
    'click #matchRadWin' : function(event) {
        event.preventDefault();
        var something = $(event.target);
        something.addClass('btn-success');

        var sibling1 = $(event.target).next('a');
        sibling1.removeClass('btn-info');

        var sibling2 = sibling1.next('a');
        sibling2.removeClass('btn-danger');

        Meteor.call('updatePlayerScoreReport', '12', 'username', '0', 'D');
        Meteor.call('checkMatchResultReports', '12');
    },
    'click #matchVoid' : function(event) {
        event.preventDefault();
        var something = $(event.target);
        something.addClass('btn-info');
        
        var sibling1 = $(event.target).prev('a');
        sibling1.removeClass('btn-success');

        var sibling2 = $(event.target).next('a');
        sibling2.removeClass('btn-danger');

        //TODO the client should have a way to know what is the Game._id

        //1) get Game item
        //2) we need to upsert a the match report into game item for current player (client)
        // game.scoreReport({
        //     'username': Meteor.username,
        //     'playerSlot': playerslot,
        //     'result': 'V'
        // })
        //3) the tracker method at this point should be triggered in theory

        // if (sibling1.hasClass("btn-success") ) {
            
        //     //TODO something
        // }
    },
    'click #matchDireWin' : function(event) {
        event.preventDefault();
        var something = $(event.target);
        something.addClass('btn-danger');
            
        var sibling1 = $(event.target).prev('a');
        sibling1.removeClass('btn-info');

        var sibling2 = sibling1.prev('a');
        sibling2.removeClass('btn-success');

        //TODO the client should have a way to know what is the Game._id

        //1) get Game item
        //2) we need to upsert a the match report into game item for current player (client)
        // game.scoreReport({
        //     'username': Meteor.username,
        //     'playerSlot': playerslot,
        //     'result': 'D'
        // })
        //3) the tracker method at this point should be triggered in theory
    }
});

Template.playerPanel.events({
    'click #thumbsUp' : function(event) {
        event.preventDefault();
        var something = $(event.target);

        // console.log(something);

        if (something.hasClass( "text-success" ) ) {
            something.removeClass('text-success');
            //TODO
            //user.commend--;
        } else {
            something.addClass('text-success');
            //TODO
            //user.commend++;
            var siblingThumbsDown = $(event.target).next('i');
            if (siblingThumbsDown.hasClass("text-danger") ) {
                siblingThumbsDown.removeClass('text-danger');
                //TODO
                //user.report--;
            }
        }

        // bootbox.prompt({
        //     title: this.username + " best player ever. Rated 10/10",
        //     callback: function(result) {
        //         if (result === null) {
        //             console.log('he left nothing');
        //         } else {
        //             console.log('are you sure?');
        //             //TODO save comments to commend
        //         }
        //     }
        // });
    },
    'click #thumbsDown' : function(event) {
        event.preventDefault();
        var something = $(event.target);

        // console.log(something);
        // console.log('=================');

        if (something.hasClass( "text-danger" ) ) {
            something.removeClass('text-danger');
            //TODO
            //user.report--;
        } else {
            something.addClass('text-danger');
            //TODO
            //user.report++;
            
            var previousThumbsUp = $(event.target).prev('i');
            if (previousThumbsUp.hasClass("text-success") ) {
                previousThumbsUp.removeClass('text-success');
                //TODO
                //user.commend--;
            }
        }

        // bootbox.prompt({
        //     title: "omg " + this.username +  ", S A D B O Y S",
        //     callback: function(result) {
        //         if (result === null) {
        //             console.log('he left nothing');
        //         } else {
        //             console.log('are you sure?');
        //             //TODO save comments to commend
        //         }
        //     }
        // });
    }
});