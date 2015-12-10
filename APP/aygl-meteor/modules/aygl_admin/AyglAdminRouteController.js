AyglAdminController = RouteController.extend({
    layoutTemplate: 'adminLayout'
});

Router.onBeforeAction(function(){
    logger.debug('XZ:DEBUG:15/2/15: hi im in myAdminHookFunction');

    if (!Meteor.user()) {
        //do nothing? dun need this.next() ?
    } else {
        //TODO XZ 15/2/15
        var isAdmin = true;

        if (!isAdmin) {
            //this.render('pageNotFound');
            //this.redirect('/pageNotFound');
            Router.go('/pageNotFound');
        } else {
            // otherwise don't hold up the rest of hooks or our route/action function
            // from running

            if (!Session.get('adminTabSelection')) {
                Session.set('adminTabSelection', 1);
            }

            this.next();
        }
    }
}, {
    only: ['aygl_admin']

});

Router.route('/aygl_admin', function() {
    switch (Session.get('adminTabSelection')) {
    case 1:
        logger.debug('im gonna render some nice stuff');
        this.render('adminMatchPendingUpdateList', {
            to: "tabContent"
        });
        break;
    case 2:
        logger.debug('selectedMatchId: ' + Session.get('selectedAyglMatchId'));
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
    case 6:
        this.render('logTable', {
            to: "tabContent"
        });
        break;
    }
}, {
    name: 'aygl_admin',
    controller:'AyglAdminController'
});
