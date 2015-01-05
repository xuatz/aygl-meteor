HomeController = RouteController.extend({
    layoutTemplate: 'homeLayout'
});

Router.route('/home', function() {
	this.next()
}, {
    name: 'home',
    controller: 'HomeController'
});
