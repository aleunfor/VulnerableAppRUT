function url() {
  var args = _.toArray(arguments);
  args.unshift(__BASE_URL__);
  var url = args.join('/');
  return _.trimEnd(url, '/').replace('//', '/');
}

function formatoRut(rut) {
	rut = $.trim(rut);
	rut = rut.replace(/[^0123456789Kk]/gi, '');
	rut = rut.replace(/k/gi, 'K');
	if (rut.length > 1) {
		if (rut.substr(rut.length - 2, 1) != '-') {
			rut = rut.substr(0, rut.length - 1) + '-' + rut.substr(rut.length - 1, 1);
		}
	}
	return rut;
}
