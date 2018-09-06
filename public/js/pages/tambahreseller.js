$(function () {
    getProvince();
    $(document.body).delegate('#propinsiPelanggan', 'change', function () {
        getCity($(this).val());
        var selectedText = $(this).find("option:selected").text();
        $("#propinsiName").val(selectedText);
    });
    $(document.body).delegate('#kabupatenPelanggan', 'change', function () {
        var selectedText = $(this).find("option:selected").text();
        $("#kabupatenName").val(selectedText);
    });

});
function getProvince() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: BASE_URL + "/provinsi",
        method: 'POST',
        success: function (response) {
            $("#propinsiPelanggan").html(response);
            $('.show-tick').selectpicker('refresh');
            $("#idpropinsi").html(response);
        },
        error: function () {
        }
    })
}

function getCity(idprovinsi) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: BASE_URL + "/kota",
        method: 'POST',
        data: {
            idprovinsi: idprovinsi
        },
        success: function (response) {
            $("#kabupatenPelanggan").html(response);
            $('.show-tick').selectpicker('refresh');
        },
        error: function () {
        }
    });
}