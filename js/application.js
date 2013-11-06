// this will be somewhere defined globally for sure
website_id = 13;

$(function() {
	// Ka.Cache.set('name', "test");
	// console.log(Ka.Cache.get('name'));

	// handle Facebook auth callback
	if (!Ka.Api.modules.users.handleFacebookCallback()) {
		// initialization
		Ka.Api.modules.users.current(function(data, status) {
			if (status != 200) {
				$("#loginContainer").show();

				Ka.Api.modules.users.loginUrl(document.location.protocol + '//' + document.location.hostname + "/wait.html", function(url) {
					if (url) {
						$("#loginContainer > a").attr("href", url);
					}
				});
			} else {
				$("#userContainer .user-email").text(data.email);
				$("#userContainer #logoutButton").on('click', function(e) {
					Ka.Api.modules.users.logout();
				});
				$("#userContainer").show();
			}
		});
	}
});