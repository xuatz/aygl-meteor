HomeController = RouteController.extend({
    layoutTemplate: 'homeLayout'
});

Router.route('/home', function() {
    this.render('homeloading', {
        to: "profile"
    });
    this.render('homeloading', {
        to: "onlinecounter"
    });
    this.render('homeloading', {
        to: "queuecounter"
    });
    this.render('homeloading', {
        to: "notification"
    });
    this.render('homeloading', {
        to: "top10"
    });
    this.next()
}, {
    name: 'home',
    controller: 'HomeController'
});
