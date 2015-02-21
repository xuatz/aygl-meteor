/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

Template.adminLayout.helpers({
    matchPendingUpdateList: function() {
        console.log('hi im in the matchPendingUpdateList helper');

        //Meteor.call('checkValidSignup', sig, function(err, res) {});

        return MatchesPendingUpdate.find().fetch();    
    }
});



/*
======================================================================================================
Template Event Handlers
All Template handlers for templates defined within signup.html will be placed here
======================================================================================================
*/

Template.adminLayout.events({
    'click #tab1': function(evt) {
        evt.preventDefault();
        console.log('clicked tab1');
        Session.set('adminTabSelection', 1);
        Meteor.call('retrieveMatchesPendingUpdateFromMainDB');
    },
    'click #tab2': function(evt) {
        evt.preventDefault();
        console.log('clicked tab2');
        Session.set('adminTabSelection', 2);
    },
    'click #tab3': function(evt) {
        evt.preventDefault();
        console.log('clicked tab3');
        Session.set('adminTabSelection', 3);
    },
    'click #tab4': function(evt) {
        evt.preventDefault();
        console.log('clicked tab4');
        Session.set('adminTabSelection', 4);
    }
});


/*
======================================================================================================
Template Rendered Handlers
All Template.rendered handlers for templates defined in signup.html will be placed here
======================================================================================================
*/

