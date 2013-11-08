Ka.Api.modulesEndpoints.users = "http://api.ka.local:8080/modusers";
Ka.Api.modules.users = {};

// callback(Object user, status)
Ka.Api.modules.users.current = function(callback) {
	Ka.Api.request('users', '/users', function(data, statusCode) {
		callback(data, statusCode);
	});
};

Ka.Api.modules.users.loginUrl = function(redirect_uri, callback) {
	var url;

	Ka.Api.request('users', '/login_url?callback='+redirect_uri, function(data, statusCode) {
		url = data.hasOwnProperty('url') ? data.url : null;
		callback(url);
	});
};

Ka.Api.modules.users.logout = function(redirect_uri, callback) {
	var redirect_uri = redirect_uri || '/';
	callback = callback || function() {}

	Ka.Api.request('users', '/sessions/'+Ka.Cache.get('access_token'), function(data, statusCode) {
		if (statusCode == 204) {
			Ka.Cache.delete('access_token');
			window.location = redirect_uri;
		} else {
			alert("Logout failed!");
		}
	}, 'DELETE');

};

Ka.Api.modules.users.handleFacebookCallback = function() {
	var tmp, splitter, params = {};

	if (document.location.hash.indexOf('access_token') > -1) {
		tmp = document.location.hash.substr(1).split('&');
		for (i in tmp) {
			splitter = tmp[i].split('=');
			params[splitter[0]] = splitter[1];
		}

		if (params.hasOwnProperty('access_token')) {
			Ka.Api.request('users', '/sessions', function(data, statusCode) {
				if (statusCode == 200) {
					Ka.Cache.set('access_token', data.token.token);
					window.location = '/';
				} else {
					alert("Handle this error!")
				}
			}, 'POST', {access_token: params.access_token, website_id: website_id});
			return true;
		}
	}

	return false;
};