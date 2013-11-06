Ka = window.Ka || {};

Ka.Cache = {};
Ka.Cache.get = function(key) {
	if (typeof key == 'undefined') return;

	Ka.Cache.clean();

	var is_json, real_key = 'kacache_' + key;

	lsval = localStorage.getItem(real_key);
	if (lsval) {
		data = JSON.parse(lsval);

		is_json = /^\{|\[.+\}|\]$/.test(data.value);
		return (is_json === true) ? JSON.parse(data.value) : data.value;
	}
	return null;
};

Ka.Cache.set = function(key, value, ttl) {
	if (!key || typeof value == 'undefined') return;

	var real_key = 'kacache_'+key, data = {};
	if (ttl) {
		data.expires = new Date().getTime() + ttl * 1000;
	}
	if (typeof value == 'object') {
		data.value = JSON.stringify(value);
	} else {
		data.value = value;
	}

	localStorage.setItem(real_key, JSON.stringify(data));
};

Ka.Cache.delete = function(key) {
	if (typeof key == 'undefined') return;

	var real_key = 'kacache_' + key;

	localStorage.removeItem(real_key);
}

Ka.Cache.clean = function() {
	this.purge(true);
};

Ka.Cache.purge = function(expired) {
	var expired = expired || false;

	for (i in localStorage) {
		if (i.indexOf('kacache_') === 0) {
			if (expired) {
				data = localStorage.getItem(i);
				is_json = /^\{|\[.+\}|\]$/.test(data);
				data = (is_json === true) ? JSON.parse(data) : data;
				if (data.hasOwnProperty('expires') && data.expires < new Date().getTime()) {
					localStorage.removeItem(i);
				}
			} else {
				localStorage.removeItem(i);
			}
		}
	}
};