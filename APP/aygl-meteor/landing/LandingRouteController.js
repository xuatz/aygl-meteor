LandingController = RouteController.extend({
    layoutTemplate: 'landingLayout'
});

Router.route('/landing', function() {
    

    this.next()
}, {
    name: 'landing',
    controller: 'LandingController'
});
