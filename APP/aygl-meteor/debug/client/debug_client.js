Template.homesidecontent.events({
    'click #spawnDummies': function(evt, template) {
        evt.preventDefault();
        Meteor.call('spawnDummies', 50);
    },
    'click #despawnDummies': function(evt, template) {
        evt.preventDefault();
        Meteor.call('despawnDummies');
    }
});

Template.pagebuilderlayout.rendered = function() {
    //INITIALIZE POPOVERS
        $('[data-toggle="tooltip"]').tooltip();
};

Template.pagebuilderlayout.helpers({
    game: function () {
        return Games.findOne({_id:'testlobby'});
    }
});

Template.pagebuilderlayout.events({
    'mouseenter': function (evt, template) {
        evt.preventDefault();
    }
});