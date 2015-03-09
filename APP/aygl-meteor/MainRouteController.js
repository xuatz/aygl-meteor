Router.onBeforeAction(function() {
    console.log('XZ:DEBUG:15/2/15: MainRouteController.onBeforeAction');
    this.render('loading');
    if (Meteor.loggingIn()) {

    } else if (!Meteor.user()) {
        Router.go('/');
    } else {
        this.next();
    }
}, {
    except: ['root', 'verifiedsignup', 'signin']
});

Router.route('/', function() {
    this.layout('main');
    if (!Meteor.loggingIn()) {
        if (Meteor.user()) {
            this.render('mainloggedin');
            this.render('mainlogoutbutton', {
                to: "register"
            });
        } else {
            this.render('mainloggedout');
            this.render('mainregister', {
                to: "register"
            });
        }
    } else {
        this.render('mainloggingin');
    }
}, {
    name: "root"
});
