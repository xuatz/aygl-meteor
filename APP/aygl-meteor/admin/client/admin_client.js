Meteor.subscribe('MatchesCollection');

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

Template.adminLayout.helpers({
    adminMatchDetailSelector: function() {
        return {author: Session.get('selectedAyglMatchId')};   
    }
});

Template.adminMatchPendingUpdateDetail.helpers({
    selectedMatch: function() {
        return MatchesCollection.findOne(Session.get('selectedAyglMatchId'));
    },
    makeUniqueID: function() {
        return "matchPlayerResult:" + this._id;
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

        Meteor.call("testMethod", function(err, res){
            if(err){
                
            }
            else {
                console.log('success!');
                console.log(res);
            }
        });
    },
    'click #tab4': function(evt) {
        evt.preventDefault();
        console.log('clicked tab4');
        Session.set('adminTabSelection', 4);
    },
    'click #tab5': function(evt) {
        evt.preventDefault();
        console.log('clicked tab5');
        Session.set('adminTabSelection', 5);
    },
    'click tr': function (event) {
        event.preventDefault();
        console.log('tableOnClick');

        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();

        switch (Session.get('adminTabSelection')) {
        case 1:
            // console.log(rowData.status);
            // console.log('rowData._id: ' + rowData._id);

            $('ul.nav-tabs li.active').removeClass('active');
            $('#tab2').addClass('active');

            Session.set('adminTabSelection', 2);
            Session.set('selectedAyglMatchId', rowData._id);

            //Meteor.call('updateSelectedMatchId', rowData._id);

            break;
        }
    }
});


/*
======================================================================================================
Template Rendered Handlers
All Template.rendered handlers for templates defined in signup.html will be placed here
======================================================================================================
*/

