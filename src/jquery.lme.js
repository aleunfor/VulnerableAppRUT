// habilitar y deshabilitar inputs
$.fn.disable = function()
{
	return this.attr('disabled', true);
};
$.fn.enable = function()
{
	return this.attr('disabled', false);
};

// Autocompletar las comunas
comunas_autocompletar = null;
$.fn.autocompletarComuna = function(input_comuna_id)
{
	var element = this;

	this.focus(element, function() {
		if (comunas_autocompletar == null) {
			$.ajax({
				url: element.attr('ref'),
				dataType: 'json',
				async: false,
				success: function(datos) {
					comunas_autocompletar = datos;
				}
			});
		}

		// Se asigna el autocomplete después de obtener el foco, para asegurar que el elemento está visible y, por lo tanto, su posición puede ser calculada
		$(this).autocomplete({
			minLength: 3,
			delay: 0,
			source: comunas_autocompletar,
			open: function() {
				$(input_comuna_id).val( '');
			},
			select: function(event, ui) {
				$(input_comuna_id).val( ui.item.id);
			},
			focus: function() {
				return false;
			},
			close: function() {
				// Se guarda el elemento actual ya que el each de jquery sobreescribe este elemento
				var input_comuna_glosa = this;
				if (input_comuna_glosa.value != '') {
					$(comunas_autocompletar).each(function(id, comuna) {
						if (comuna.label.toLowerCase() == input_comuna_glosa.value.toLowerCase()) {
							input_comuna_glosa.value = comuna.label;
							$(input_comuna_id).val( comuna.id);
							return false;
						}
					});
				}
			}
		});
	});
}

$.fn.calendario = function(options)
{
	var settings = {
		changeMonth: true,
		changeYear: true,
		dateFormat: 'dd/mm/yy',
		monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
		dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
		firstDay: 1,
		yearRange: '2009:2023',
		showAnim: ''
	};

	this.datepicker($.extend(settings, options));
}

$.fn.fortaleza = function(){
	$(this).each(function(){
		elem = $(this);
		msg = $('<strong class="Fortaleza">&nbsp;</strong>');
		elem.after(msg)
		elem.data("mensaje", msg);
		elem.keyup(function(e){
			elem = $(this);
			msg = elem.data("mensaje")
			claveActual = elem.val();
			var fortalezaActual = "";
			puntos = 0;
			if (claveActual.size == 0) {
				msg.html('');
				return false;
			}
			if (claveActual.length > 4) {
				puntos = puntos + 10;
			}
			reg_ex = /[a-z]/;
			if (reg_ex.test(claveActual)) {
				puntos = puntos + 10;
			}
			reg_ex = /[A-Z]/;
			if (reg_ex.test(claveActual)) {
				puntos = puntos + 10;
			}
			reg_ex = /[0-9]/;
			if (reg_ex.test(claveActual)) {
				puntos = puntos + 10;
			}
			if (puntos == 10) {
				fortalezaActual = "Débil";
			}
			if (puntos == 20) {
				fortalezaActual = "Media";
			}
			if (puntos == 30) {
				fortalezaActual = "Fuerte";
			}
			if (puntos == 40) {
				fortalezaActual = "Extra";
			}
			msg.html(fortalezaActual);
		});
	});
	return this;
}

// Autocompletar las comunas
var cie10_autocompletar = '';
$.fn.autocompletarCie10 = function(input_cie10_id) {
	if (cie10_autocompletar == '') {
		$.ajax({
			url: this.attr('ref'),
			dataType: 'json',
			async: false,
			success: function(datos) {
				cie10_autocompletar = datos;
			}
		});
	}
	this.focus(function() {
		// Se asigna el autocomplete después de obtener el foco, para asegurar que el elemento está visible y, por lo tanto, su posición puede ser calculada
		$(this).autocomplete({
			minLength: 3,
			delay: 0,
			source: cie10_autocompletar,
			open: function() {
				$(input_cie10_id).val( '');
			},
			select: function(event, ui) {
				$(input_cie10_id).val( ui.item.id);
			},
			focus: function() {
				return false;
			},
			close: function() {
				// Se guarda el elemento actual ya que el each de jquery sobreescribe este elemento
				var input_cie10_glosa = this;
				if (input_cie10_glosa.value != '') {
					$(cie10_autocompletar).each(function(id, cie10) {
						if (cie10.label.toLowerCase() == input_cie10_glosa.value.toLowerCase()) {
							input_cie10_glosa.value = cie10.label;
							$(input_cie10_id).val( cie10.id);
							input_cie10_glosa.focus();
							return false;
						}
					});
				}
			}
		});
	});
}
