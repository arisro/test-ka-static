Ka = window.Ka || {};

Ka.Api = {};
Ka.Api.modulesEndpoints = {};
Ka.Api.modules = {};

// callback should have a definition like doOnComplete(data, statusCode, jqXHR)
Ka.Api.request = function(module, path, callback, method, payload) {
	if (!this.modulesEndpoints.hasOwnProperty(module)) return null;

	var method = method || 'GET';
	var payload = payload || {};

	var url = this.modulesEndpoints[module] + path;
	var req = {
		data: payload,
		cache: false,
		crossDomain: true,
		dataType: 'json',
		headers: {}
	};
	if (Ka.Cache.get('access_token')) {
		req.headers['Authorization'] = 'Token token="'+Ka.Cache.get('access_token')+'"';
	}
	if (method != 'GET') {
		req.type = 'POST';
		payload._method = method;
	}

	$.ajax(url, req)
		.done(function(data, textStatus, jqXHR) {
			callback(data, jqXHR.status, jqXHR);
		})
		.fail(function(jqXHR, textStatus, error) {
			callback(null, jqXHR.status, jqXHR);
		});
};