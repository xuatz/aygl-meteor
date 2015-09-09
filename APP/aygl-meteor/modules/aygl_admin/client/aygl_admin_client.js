Meteor.subscribe('MatchesCollection');

/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

Template.adminMatchPendingUpdateList.helpers({
  selector: function () {
    return { status: {$in: ['PU', "PI"]}};
  }
});

Template.logTable.helpers({
    logs: function() {
        return MyLogger.find().fetch();
    },
    convert: function(obj) {
        return JSON.stringify(obj);
    }
});

Template.adminMatchPendingUpdateList.events({
    'click #PU' : function(event) {
        event.preventDefault();

        MatchesCollection.insert({status : 'PU', result: 'R'});
    },
    'click #PI' : function(event) {
        event.preventDefault();

        MatchesCollection.insert({status : 'PI', result: 'I'});
    },
    'click #normal' : function(event) {
        event.preventDefault();

        MatchesCollection.insert({status : 'U', result: 'D'});
    }
});

Template.adminMatchPendingUpdateDetail.events({
    'click #processMatch' : function(event) {
        event.preventDefault();
        Meteor.call('sendMatchDetailsToMainDB', Session.get('selectedAyglMatchId'), function(err, res) {
            logger.debug('oh there is something here');

            if (err) {
                logger.error(err);
            } else {
                if (res) {
                    logger.debug(res);
                    if (res === 201) {
                        Session.set('adminTabSelection', 1);
                    } else {
                        logger.debug('there was some problem, match failed to process');
                        //TODO extra friendly handling
                    }
                }
            }
        });

        logger.debug('done, waiting for async');
    }
});


Template.adminLayout.helpers({
    matchPendingUpdateList: function() {
        logger.debug('hi im in the matchPendingUpdateList helper');

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
        logger.debug('clicked tab1');
        Session.set('adminTabSelection', 1);
        Meteor.call('retrieveMatchesPendingUpdateFromMainDB');
    },
    'click #tab2': function(evt) {
        evt.preventDefault();
        logger.debug('clicked tab2');
        Session.set('adminTabSelection', 2);
    },
    'click #tab3': function(evt) {
        evt.preventDefault();
        logger.debug('clicked tab3');
        Session.set('adminTabSelection', 3);

        Meteor.call("testMethod", function(err, res){
            if(err){
                
            }
            else {
                logger.debug('success!');
                logger.debug(res);
            }
        });
    },
    'click #tab4': function(evt) {
        evt.preventDefault();
        logger.debug('clicked tab4');
        Session.set('adminTabSelection', 4);
    },
    'click #tab6': function(evt) {
        evt.preventDefault();
        logger.debug('clicked tab6');
        Session.set('adminTabSelection', 6);
    },
    'click tr': function (event) {
        event.preventDefault();
        logger.debug('tableOnClick');

        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(event.currentTarget).data();

        switch (Session.get('adminTabSelection')) {
        case 1:

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

