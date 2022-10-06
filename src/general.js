if (window.location.protocol != "https:") {
	window.location.protocol = "https";
}

/* validarRUT
 * Toma un un string rut que contiene el RUT sin dígito verificador ni puntuación y un caracter dv
 * que contiene el dígito verificador en mayúscula.  Comprueba si el digito verificador corresponde
 * al RUT.  Los rangos para determinar el tipo de RUT no estan confirmados, son sólo estimaciones.
 * Salidas:
 *  false - La combinación de RUT y dígito verificador es incorrecta.
 *  "extranjero" - El dígito verificador es correcto y el RUT corresponde a un extranjero.
 *  "natural" - El dígito verificador es correcto y el RUT corresponde a un persona natural.
 *  "juridica" - El dígito verificador es correcto y el RUT corresponde a un persona jurídica.
 */


function validarRUT(rut, dv) {
	var suma = 0;
	var mod = 0;
	var S = 0;
	var Rf = 0;
	var digito_valido = '';
	var rutCompleto = rut+ "-" +dv;
	if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
		return false;

	if (rut <= 0) {
		return false;
	}
	if(rut.length > 8){
		return false;
	}

	// Revision de parametros
	rut = parseInt(rut) + '';

	if (dv == "K" || dv == "k") {
		dv = "K";
	} else {
		dv = parseInt(dv) + "";
	}

	// RUT para extranjeros
	if (parseInt(rut) > 99999 && parseInt(rut) < 100000) {
		if (rut.substr(0, 1) == dv) {
			return "extranjero";
		} else {
			return false;
		}
	}

	// Calculo de digito valido de acuerdo a RUT
	for (i = rut.length; i > 0; i--) {
		S += parseInt(rut.substr(i - 1, 1)) * (mod + 2);
		mod = (mod + 1) % 6;
	}

	Rf = 11 - (S % 11);
	if (Rf == 11) {
		digito_valido = "0";
	}
	if (Rf == 10) {
		digito_valido = "K";
	}
	if (Rf < 10) {
		digito_valido = Rf + "";
	}
	if (dv == digito_valido) {
		if (parseInt(rut) < 50000000) {
			return "natural"
		} else {
			return "juridica"
		}
	}

	return false;
}

/**
 * Formatear numero agregando separador de miles
 */
function formatNumber(num, decimal, currency) {
	if (typeof(num) != 'string') {
		num = '' + num;
	}

	numeral.language('es');

	decimal = decimal || false;
	currency = currency || false;

	var decimal_format = decimal == true ? '.00' : '';
	var currency_format = currency == true ? '$' : '';

	return numeral(numeral().unformat(num)).format(currency_format + ' 0,0' + decimal_format);
}

/* Validar si es de tipo entero un valor */
function esNumericoEntero(num) {
	var er = /^[0-9]+$/;
	if (num.toString().match(er) != null) {
		return true;
	} else {
		return false;
	}
}

/* Suma dias a la fecha entregada */
function sumarDias(fecha_original, dias, restar) {
	var d = 0;
	var m = 0;
	var Y = 0;
	var fecha;

	if (!esFechaValida(fecha_original)) {
		var fecha_actual = new Date();
		d = parseInt(fecha_actual.getDate(), 10);
		m = parseInt(fecha_actual.getMonth() + 1, 10);
		Y = parseInt(fecha_actual.getFullYear(), 10);
	} else {
		var fecha_tmp = fecha_original.toString().split('/');
		d = parseInt(fecha_tmp[0], 10);
		m = parseInt(fecha_tmp[1], 10);
		Y = parseInt(fecha_tmp[2], 10);
	}

	if (dias < 0 || !esNumericoEntero(dias)) {
		dias = 0;
	}

	// restamos o sumamos días
	if (restar === true) {
		d -= dias;
	} else {
		d += dias;
	}

	// Creamos elemento con la fecha original
	fecha = new Date(Y, (m - 1), d);

	d = fecha.getDate().toString().length == 1 ? '0' + fecha.getDate() : fecha.getDate();
	m = (fecha.getMonth() + 1).toString().length == 1 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
	Y = fecha.getFullYear();
	var fecha_final = d + '/' + m + '/' + Y;

	return fecha_final;
}

function restarDias(fecha_original, dias) {
	return sumarDias(fecha_original, dias, true);
}

/* Validar fecha dd/mm/yyyy */
function esFechaValida(fecha) {
	if (fecha != "") {
		var num_dias = 0;
		if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
			return false;
		}
		var d = parseInt(fecha.substring(0, 2), 10);
		var m = parseInt(fecha.substring(3, 5), 10);
		var Y = parseInt(fecha.substring(6), 10);
		switch (m) {
			case 1: case 3: case 5: case 7: case 8:  case 10: case 12:
				num_dias = 31;
				break;
			case 4: case 6: case 9: case 11:
				num_dias = 30;
				break;
			case 2:
				if (comprobarSiBisisesto(Y)) {
					num_dias = 29;
				} else {
					num_dias = 28;
				}
				break;
			default:
				return false;
		}
		if (d > num_dias || d < 1){
			return false;
		}

		return true;
	} else {
		return false;
	}
}

function comprobarSiBisisesto(Y) {
	if ((Y % 100 != 0) && ((Y % 4 == 0) || (Y % 400 == 0))) {
		return true;
	} else {
		return false;
	}
}

function mostrarDivError(nombre, glosa, input) {
	if(typeof input != 'undefined'){
		input.addClass('color_input_error');
        input.focus();
	}
	$('#div_error_' + nombre + ' .glosa').html(glosa);
	$('#div_error_' + nombre).show();
	$('#div_error_' + nombre)[0].scrollIntoView();
	return false;
}

function ocultarDivError(nombre) {
	$('.color_input_error').each(function() {
    	$(this).removeClass('color_input_error');
	});
	$('#div_error_' + nombre).hide();
	return true;
}

function mostrarDivAlerta(nombre, glosa, titulo) {
	if (typeof(titulo) == 'undefined') {
		titulo = "Advertencia";
	}
	$('#div_alerta_' + nombre + ' .titulo').html(titulo);
	$('#div_alerta_' + nombre + ' .glosa').html(glosa);
	$('#div_alerta_' + nombre).show();
	return false;
}

function ocultarDivAlerta(nombre) {
	$('#div_alerta_' + nombre).hide();
	return true;
}

function formatoRut(rut) {
	// borramos los puntos, guiones y cambiamos las k por K
	rut = $.trim(rut);
	rut = rut.replace(/[^0123456789Kk]/gi, '');
	rut = rut.replace(/k/gi, 'K');

	// ponemos el guión en caso de no estar presente
	if (rut.length > 1) {
		if (rut.substr(rut.length - 2, 1) != '-') {
			rut = rut.substr(0, rut.length - 1) + '-' + rut.substr(rut.length - 1, 1);
		}
	}

	return rut;
}

function validarEmail(email) {
	var regx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	if (regx.test(email)) {
		return true;
	}
	return false;
}

/**
 * return boolean
 * true: sí expiró la sesión
 * false: no expiró la sesión
 */
function verificarExpiroSesion() {
	$.ajax({
		type: 'post',
		url: url_validar_expiro_sesion,
		data: '',
		async: false,
		error: function(XMLHttpRequest, textStatus) {},
		success: function(data) {
			if (data != '') {
				$('#div_expiro_sesion').html(data);
				return true;
			} else {
				return false;
			}
		}
	});

	return false;
}

function iniciarRedireccion(url, msg, time) {
	if (typeof(msg) != 'undefined') {
		if (msg != '') {
			$('#div_redireccionar .msg').html(msg);
		}
	}
	time = typeof(time) != 'undefined' ? time : 1;
	$("#div_redireccionar").show();

	setTimeout(function() {
		location.href = url;
	}, time * 1000);
}

/**
 * Imprimir contenido de un objeto
 * Uso: var r = new print_JS(); alert(r.recorrer(objeto));
 */
function print_JS() {
	this.a = '';
	this.recorrer = function(o) {
		if (o.constructor == Array)
			this.a += '[';
		if (o.constructor == Object)
			this.a += '{';
		for (var i in o) {
			if (o.constructor != Array)
				this.a += i + ':';
			if (o[i].constructor==Object) {
				this.recorrer(o[i]);
			} else if(o[i].constructor == Array) {
				this.recorrer(o[i]);
			} else if(o[i].constructor == String) {
				this.a += '"' + o[i] + '",';
			} else {
				this.a += o[i] + ',';
			}
		}
		if (o.constructor == Object)
			this.a += '},';
		if (o.constructor == Array)
			this.a += '],';
		return this.a.substr(0, this.a.length-1).split(',}').join('}').split(',]').join(']');
	}
}

function calcularDiasTranscurridos(date_str_1, date_str_2) {
	var dias_transcurridos = 0;
	var one_day = 1000 * 60 * 60 * 24;
	var date_1 = new Date();
	var date_2 = new Date();

	var date_arr_1 = date_str_1.split('-');
	var date_arr_2 = date_str_2.split('-');

	date_1.setFullYear(date_arr_1[0], (date_arr_1[1] - 1), date_arr_1[2]);
	date_2.setFullYear(date_arr_2[0], (date_arr_2[1] - 1), date_arr_2[2]);

	dias_transcurridos = (date_1.getTime() - date_2.getTime()) / one_day;

	if (dias_transcurridos > 1) {
		dias_transcurridos = Math.floor(dias_transcurridos);
	} else {
		dias_transcurridos = Math.ceil(dias_transcurridos);
	}

	return Math.abs(dias_transcurridos);
}

function validarTelefono(telefono) {
	return /^[0-9]{2,2}-[0-9]{7,8}$/.test(telefono);
}

function roundNumber(num, dec) {
	var result = Math.round( Math.round( num * Math.pow( 10, dec + 1 ) ) / Math.pow( 10, 1 ) ) / Math.pow(10,dec);
	return result;
}

function unformatNumber(num) {
	numeral.language('es');
	return numeral().unformat(num);
}

/**
 * f1 "YYYY-mm-dd"
 * f2 "YYYY-mm-dd"
 *
 * return:
 *  0: son iguales.
 *  menor a 0: la primera fecha es menor.
 *  mayor a 0: la primera fecha es mayor.
 */
function compararFechas(f1, f2) {
	var _f1 = new Date(f1 + ' 00:00:00');
	var _f2 = new Date(f2 + ' 00:00:00');
	return _f1.getTime() - _f2.getTime();
}

function validarTelefonoCelular(telefono) {
	var regx = /^[1-9][0-9]{7}$/;
	if (regx.test(telefono)) {
		return true;
	}
	return false;
}

/**
 * Limpia los formularios
 */
function clearFormElements(ele) {
	$(ele).find(':input').each(function() {
		switch (this.type) {
			case 'password':
			case 'select-multiple':
			case 'select-one':
			case 'text':
			case 'textarea':
				$(this).val('');
				break;
			case 'checkbox':
			case 'radio':
				this.checked = false;
		}
	});
}

function tooltip() {
	xOffset = 5;
	yOffset = 12;

	$('.tooltip').hover(
		function(e) {
			this.t = this.title;
			this.title = '';

			$('body').append('<p id="tooltip">' + this.t + '</p>');
			$('#tooltip')
				.css('top', (e.pageY - xOffset) + 'px')
				.css('left', (e.pageX + yOffset) + 'px')
				.fadeIn('fast');
		},
		function() {
			this.title = this.t;
			$('#tooltip').remove();
	});

	$('.tooltip').mousemove(function(e){
		$('#tooltip')
			.css('top', (e.pageY - xOffset) + 'px')
			.css('left', (e.pageX + yOffset) + 'px');
	});
}

function inArray(needle, haystack) {
	var length = haystack.length;
	for(var i = 0; i < length; i++) {
		if(haystack[i] == needle) return true;
	}
	return false;
}

function empty(e) {
	return ($(e).val() == '' || $(e).val() == '0' || $(e).val() == 0 ||$(e).val() == null) ? true : false;
}

/**
 * fecha "dd/mm/YYYY"
 *
 * return:
 *  fecha "YYYY-mm-dd"
 */
function convertirAFecha(fecha){
	var d = fecha.substring(0, 2);
	var m = fecha.substring(3, 5);
	var Y = fecha.substring(6);

	return (Y + '-' + m + '-' + d);
}

function campoVacio(e) {
	var regex = /[a-zA-Z0-9]{1,64}/;
	var valor = $(e).val();

	return !regex.test(valor) ? true : false;
}
