$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(".select2").select2();

    $(".form-control").attr("autocomplete", "off");
    $(".form-select").attr("autocomplete", "off");

    $('.documento_identidad').inputmask("999-9999999-9");
    $('.telefono').inputmask("(999) 999-9999");

    //$(".onlyLetter").lettersOnly();

    //$(".onlyNumber").numbersOnly();

});

$(document).on("keyup", ".max_number", function () {
    var valor = $(this).val();

    if (valor > parseInt($(this).attr("max")) && valor != "") {
        $("input[name='" + $(this).prop("name") + "']").val("").trigger("change");
    }
    else if (valor < parseInt($(this).attr("min")) && valor != "") {
        $("input[name='" + $(this).prop("name") + "']").val("").trigger("change");
    }

});

$(document).on("change", ".maxDayToday", function () {
    var fecha = $(this).val();
    if (fecha.length == 10) {
        if (fecha > moment().format("yyyy-MM-DD")) {
            $("input[name='" + $(this).prop("name") + "']").val("").trigger("change");
        }
    }
});

$(document).on("change", ".minDayToday", function () {
    var fecha = $(this).val();
    if (fecha.length == 10) {
        if (fecha < moment().format("yyyy-MM-DD")) {
            $("input[name='" + $(this).prop("name") + "']").val("").trigger("change");
        }
    }
});

$(document).on("click", ".btn_delete_consultar", function () {
    var form = $(this).closest("form");
    swal.fire({
        title: "Confirmación",
        html: "<center><h5>Está seguro que desea eliminar el registro?</h5></center>",
        type: "warning",
        confirmButtonText: 'Si',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
    }).then(function (isConfirmed) {
        if (isConfirmed.value) {
            MuestraLoading();
            form.submit()
        } else {
            notificar("error", "Eliminación de Registro Cancelada")
        }
    });
});

//Validar Inputs
function validar(entidad) {
    var seguir = true;
    var focus = true;
    var listado = "";
    entidad.find('input:required, select:required, textarea:required').each(function () {
        if ($(this).prop('required')) {

            var name = $(this).attr('name');

            if (!$(this).val() && name != undefined) {
                seguir = false;
                var fail_log = "El campo " + $("label[for='" + name + "']").html() + " es requerido";
                listado += "<li>" + $("label[for='" + name + "']").html() + "</li>";
                if (focus) {
                    focus = false;
                    $(this).focus();
                }
                if ($(this).is("select")) {
                    $("select[name='" + name + "']").addClass("is-invalid");
                    $("div[for='" + name + "']").html(fail_log)
                } else if ($(this).is("textarea")) {
                    $("textarea[name='" + name + "']").addClass("is-invalid");
                    $("div[for='" + name + "']").html(fail_log)
                } else {
                    $("input[name='" + name + "']").addClass("is-invalid");
                    $("div[for='" + name + "']").html(fail_log)
                }
            } else {
                if ($(this).is("select")) {
                    $("select[name='" + name + "']").removeClass("is-invalid");
                    $("div[for='" + name + "']").html('')
                } else {
                    $("input[name='" + name + "']").removeClass("is-invalid");
                    $("div[for='" + name + "']").html('')
                }
            }
        }
    });

    if (!seguir) {
        notificarhtml("error", "Los siguientes campos son obligatorios, favor completa <br><br><ul style='text-align:left !important'>" + listado + "</ul>");
    }

    return seguir;
}
//Validar Inputs

function notificarConfirmacion(titulo, cuerpo, callbackOk = null, callbackCancel = null, showLoading = true) {
    swal.fire({
        title: titulo,
        html: "<center><h5>" + cuerpo + "</h5></center>",
        type: "warning",
        confirmButtonText: 'Si',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
    }).then(function (isConfirmed) {
        if (isConfirmed.value) {
            if (typeof callbackOk === typeof Function) {
                if (showLoading) {
                    MuestraLoading();
                }
                callbackOk();
            }
        } else {
            if (typeof callbackCancel === typeof Function) {
                callbackCancel()
            }
        }
    });

}

function MuestraLoading() {
    swal({
        title: 'En Proceso',
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 0,
        width: "12em",
        onOpen: () => {
            swal.showLoading();
        }
    });
}

function loader_logo_shown() {
    swal({
        title: 'En Proceso',
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 0,
        width: "12em",
        onOpen: () => {
            swal.showLoading();
        }
    });
}

function loader_logo_hidden() {
    swal.close();
}
function notificar(tipo, mensaje) {
    Swal({
        title: "Alerta!",
        text: mensaje,
        type: tipo,
    })
}

function notificarhtml(tipo, mensaje) {
    swal({
        title: "Alerta!",
        html: mensaje,
        type: tipo,
    })
}

function notificar_url(tipo, mensaje, url) {
    swal.fire({
        title: "Alerta!",
        text: mensaje,
        type: tipo,
    }).then(function () {
        window.location.replace(url);
    });
}

function ConvertISODatetoDateFormat(data) {
    var mDate = moment(new Date(data)).format("DD/MM/yyyy");
    if (mDate == '31/12/1899' || mDate == '01/01/1900' || mDate == '1/1/1900' || mDate == "31/12/1899" || mDate == "01/01/1900" || mDate == "31/12/0000") {
        return null;
    }
    else {
        return new Date(moment(data));
    }
}

function calcularEdad(fecha) {

    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
}