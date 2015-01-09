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

Meteor.methods({
    lol: function() {
        if (Meteor.isClient) {
            $.growl({
                message: "You've been matched up! Click to meet your Team!",
                title: '<strong>Yay!</strong>',
                icon: 'fa fa-users fa-lg'
            }, {
                animate: {
                    enter: "animated bounceInLeft",
                    exit: "animated bounceOutRight"
                },
                placement: {
                    from: "bottom",
                    align: "center"
                },
                type: 'success',
                template: '\
<div data-growl="container" class="alert col-xs-4" role="alert">\
	<button type="button" class="close" data-growl="dismiss">\
		<span aria-hidden="true">×</span>\
		<span class="sr-only">Close</span>\
	</button>\
	<span data-growl="icon"></span> - \
	<span data-growl="title"></span> : \
	<span data-growl="message"></span>\
	<a href="#" data-growl="url"></a>\
</div>\
'
            });
        }
    }
});
