AdminController = RouteController.extend({
    layoutTemplate: 'adminLayout'
});

Router.onBeforeAction(function(){
    console.log('XZ:DEBUG:15/2/15: hi im in myAdminHookFunction');

    if (!Meteor.user()) {
        //do nothing? dun need this.next() ?
    } else {
        //TODO XZ 15/2/15 
        //!Meteor.isAdmin
        
        var isAdmin = true;

        if (!isAdmin) {
            //this.render('pageNotFound');
            //this.redirect('/pageNotFound');
            Router.go('/pageNotFound');
        } else {
            // otherwise don't hold up the rest of hooks or our route/action function
            // from running
            this.next();
        }
    }
}, {
    only: ['admin']

});

Router.route('/admin', function() {
    switch (Session.get('adminTabSelection')) {
    default:
        Session.set('adminTabSelection', '1');
    case 1:
        console.log('im gonna render some nice stuff');
        this.render('adminMatchPendingUpdateList', {
            to: "tabContent"
        });
        break;
    case 2:
        console.log('selectedMatchId: ' + Session.get('selectedAyglMatchId'));
        this.render('adminMatchPendingUpdateDetail', {
            to: "tabContent"
        });
        break;
    case 3:
        this.render('reviewReportListing', {
            to: "tabContent"
        });
        break;
    case 4:
        this.render('reviewReportDetail', {
            to: "tabContent"
        });
        break;
    }
}, {
    name: 'admin',
    controller:'AdminController'
});
