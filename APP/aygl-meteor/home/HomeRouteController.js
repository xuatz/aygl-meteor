HomeController = RouteController.extend({
    layoutTemplate: 'homeLayout'
});

Router.route('/home', function() {
    /*
        Main Content Block Rendering Logic
    */

    if (Meteor.user().profile.state === 'hosting') {
        this.render('homecaptainslobby', {
            to: "maincontent"
        });
    } else {
        this.render('homemaincontent', {
            to: "maincontent"
        });
    }

    this.render('homeprofile', {
        to: "profile"
    });
    this.render('homesidecontent', {
        to: "notification"
    });
    this.render('hometop10', {
        to: "top10"
    });
    this.render('homextra', {
        to: "xtra"
    });
    this.next()
}, {
    name: 'home',
    controller: 'HomeController'
});
