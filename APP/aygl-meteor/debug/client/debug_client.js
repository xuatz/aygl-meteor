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
