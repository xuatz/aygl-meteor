HomeController = RouteController.extend({
    layoutTemplate: 'homeLayout'
});

Router.route('/home', function() {
    this.render('homeprofile', {
        to: "profile"
    });
    this.render('homemaincontent', {
        to: "maincontent"
    });
    this.render('homeonlinecounter', {
        to: "onlinecounter"
    });
    this.render('homequeuecounter', {
        to: "queuecounter"
    });
    this.render('homenotification', {
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
