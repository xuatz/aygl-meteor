/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

Template.homeprofile.helpers({
    myprofile: function() {
        return Meteor.user();
    }
});




/*
======================================================================================================
Template Event Handlers
All Template handlers for templates defined within signup.html will be placed here
======================================================================================================
*/

Template.homenotification.events({
    'click #testnotification': function(evt) {
        evt.preventDefault();
        shownotification(Meteor.user().username);
    }
});


/*
======================================================================================================
Template Rendered Handlers
All Template.rendered handlers for templates defined in signup.html will be placed here
======================================================================================================
*/


shownotification = function(name) {
    $.growl({
        message: "You've been matched up! Click to meet your Team!",
        title: '<strong>Yay, ' + name + '!</strong>',
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
</div>'
    });
}
